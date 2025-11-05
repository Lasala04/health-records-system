import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { checkRateLimit } from '@/lib/rateLimit';

function validateApiKey(request: NextRequest, isInternal: boolean = false): boolean {
  // Skip API key validation for internal requests (from UI)
  if (isInternal) return true;
  
  const apiKey = request.headers.get('x-api-key');
  return !!(apiKey && apiKey === process.env.API_KEY);
}

function validateInput(name: string, contact: string): boolean {
  if (name.length < 2 || name.length > 100) return false;
  if (contact.length < 5 || contact.length > 50) return false;
  
  const nameRegex = /^[a-zA-Z\s\-'.]+$/;
  const contactRegex = /^[0-9\-\+\(\)\s]+$/;
  
  return nameRegex.test(name) && contactRegex.test(contact);
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0];
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  
  return 'unknown';
}

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Check if from internal UI (no API key needed)
    const isInternal = !request.headers.get('x-api-key');
    
    if (!isInternal && !validateApiKey(request, false)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const patients = db.prepare('SELECT * FROM patients ORDER BY name').all();
    return NextResponse.json(patients);
  } catch (error) {
    console.error('GET /api/patients error:', error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Check if from internal UI (no API key needed)
    const isInternal = !request.headers.get('x-api-key');
    
    if (!isInternal && !validateApiKey(request, false)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { name, dob, contact, bloodType, address } = body;

    if (!name || !dob || !contact) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!validateInput(name, contact)) {
      return NextResponse.json(
        { error: 'Invalid input format' },
        { status: 400 }
      );
    }

    const stmt = db.prepare(`
      INSERT INTO patients (id, name, dob, contact, blood_type, address)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const id = `patient_${Date.now()}`;
    const result = stmt.run(id, name, dob, contact, bloodType || null, address || null);

    return NextResponse.json({ 
      success: true, 
      id,
      changes: result.changes
    });
  } catch (error) {
    console.error('POST /api/patients error:', error);
    return NextResponse.json({ 
      error: 'Failed to create patient',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}