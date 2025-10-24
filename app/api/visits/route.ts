import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const visits = db.prepare('SELECT * FROM visits ORDER BY date DESC').all();
    return NextResponse.json(visits);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch visits' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, patientId, date, diagnosis, medication, notes } = body;

    const stmt = db.prepare(`
      INSERT INTO visits (id, patient_id, date, diagnosis, medication, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, patientId, date, diagnosis, medication || null, notes || null);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create visit' }, { status: 500 });
  }
}