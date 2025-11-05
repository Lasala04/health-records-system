import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all patients
export async function GET() {
  try {
    const patients = db.prepare('SELECT * FROM patients ORDER BY created_at DESC').all();
    return NextResponse.json(patients);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

// CREATE new patient
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, dob, contact, bloodType, address } = body;

    const stmt = db.prepare(`
      INSERT INTO patients (id, name, dob, contact, blood_type, address)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, name, dob, contact, bloodType || null, address || null);

    return NextResponse.json({ success: true, id });
  } catch {
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}