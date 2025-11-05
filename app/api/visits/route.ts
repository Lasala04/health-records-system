import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { checkRateLimit } from '@/lib/rateLimit';

function validateApiKey(request: NextRequest, isInternal: boolean = false): boolean {
  if (isInternal) return true;
  const apiKey = request.headers.get('x-api-key');
  return !!(apiKey && apiKey === process.env.API_KEY);
}

function validateInput(diagnosis: string, medication?: string | null): boolean {
  if (!diagnosis || diagnosis.length < 2 || diagnosis.length > 500) return false;
  if (medication && (medication.length < 2 || medication.length > 500)) return false;
  
  const sqlInjectionPattern = /['";\\-]/;
  if (sqlInjectionPattern.test(diagnosis) || (medication && sqlInjectionPattern.test(medication))) {
    return false;
  }
  
  return true;
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

    const isInternal = !request.headers.get('x-api-key');
    if (!isInternal && !validateApiKey(request, false)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const visits = db.prepare('SELECT * FROM visits ORDER BY date DESC').all();
    return NextResponse.json(visits);
  } catch (error) {
    console.error('GET /api/visits error:', error);
    return NextResponse.json({ error: 'Failed to fetch visits' }, { status: 500 });
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

    const isInternal = !request.headers.get('x-api-key');
    if (!isInternal && !validateApiKey(request, false)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { patient_id, date, diagnosis, medication, notes } = body;

    let visitId = body.id as string | undefined;
    if (!visitId) {
      visitId = `visit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    if (!patient_id || !date || !diagnosis) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['patient_id', 'date', 'diagnosis'],
          received: { patient_id, date, diagnosis }
        },
        { status: 400 }
      );
    }

    if (!validateInput(diagnosis, medication)) {
      return NextResponse.json(
        { error: 'Invalid input format' },
        { status: 400 }
      );
    }

    const patientExists = db.prepare('SELECT id FROM patients WHERE id = ?').get(patient_id);
    if (!patientExists) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    const stmt = db.prepare(`
      INSERT INTO visits (id, patient_id, date, diagnosis, medication, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(visitId, patient_id, date, diagnosis, medication || null, notes || null);

    return NextResponse.json({ 
      success: true, 
      id: visitId,
      changes: result.changes
    });
  } catch (error) {
    console.error('POST /api/visits error:', error);
    return NextResponse.json({ 
      error: 'Failed to create visit',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}