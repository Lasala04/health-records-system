import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// UPDATE patient
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { name, dob, contact, bloodType, address } = body;
    const { id } = await context.params; // FIXED: await params

    const stmt = db.prepare(`
      UPDATE patients 
      SET name = ?, dob = ?, contact = ?, blood_type = ?, address = ?
      WHERE id = ?
    `);

    stmt.run(name, dob, contact, bloodType || null, address || null, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update patient' }, { status: 500 });
  }
}

// DELETE patient
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // FIXED: await params
    db.prepare('DELETE FROM patients WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete patient' }, { status: 500 });
  }
}