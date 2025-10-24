import Database from 'better-sqlite3';
import path from 'path';

// Create database file in your project folder
const dbPath = path.join(process.cwd(), 'health_records.db');
const db = new Database(dbPath);

// Enable foreign keys (connects related data)
db.pragma('foreign_keys = ON');

// Create tables (like spreadsheet sheets)
db.exec(`
  CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    dob TEXT NOT NULL,
    contact TEXT NOT NULL,
    blood_type TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS visits (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    date TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    medication TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
  );
`);

export default db;