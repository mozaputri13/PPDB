import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'ppdb.db');
export const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      nisn TEXT UNIQUE,
      email TEXT UNIQUE,
      nama TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('student', 'admin')),
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      jalur TEXT NOT NULL CHECK(jalur IN ('Reguler', 'Prestasi', 'Afirmasi')),
      status TEXT NOT NULL CHECK(status IN ('Draft', 'Submitted', 'Under Review', 'Needs Revision', 'Verified', 'Accepted', 'Not Accepted')),
      revisi_notes TEXT DEFAULT '',
      verified_by TEXT,
      verified_at TEXT,
      submitted_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS student_profiles (
      id TEXT PRIMARY KEY,
      registration_id TEXT UNIQUE NOT NULL,
      nik TEXT NOT NULL,
      nama_lengkap TEXT NOT NULL,
      tempat_lahir TEXT,
      tanggal_lahir TEXT,
      jenis_kelamin TEXT CHECK(jenis_kelamin IN ('Laki-laki', 'Perempuan')),
      agama TEXT,
      alamat_lengkap TEXT,
      FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS parent_profiles (
      id TEXT PRIMARY KEY,
      registration_id TEXT UNIQUE NOT NULL,
      nama_ayah TEXT,
      pekerjaan_ayah TEXT,
      nama_ibu TEXT,
      pekerjaan_ibu TEXT,
      no_whatsapp TEXT,
      FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS school_origins (
      id TEXT PRIMARY KEY,
      registration_id TEXT UNIQUE NOT NULL,
      nama_sekolah TEXT,
      npsn TEXT,
      tahun_lulus TEXT,
      nilai_rata_rata REAL DEFAULT 0.0,
      FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS uploaded_documents (
      id TEXT PRIMARY KEY,
      registration_id TEXT NOT NULL,
      document_type TEXT NOT NULL CHECK(document_type IN ('kk', 'akta', 'pasfoto', 'skl')),
      file_path TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      mime_type TEXT NOT NULL,
      is_verified INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ppdb_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      academic_year TEXT NOT NULL,
      quota_total INTEGER NOT NULL,
      quota_reguler INTEGER NOT NULL,
      quota_prestasi INTEGER NOT NULL,
      quota_afirmasi INTEGER NOT NULL,
      registration_start TEXT,
      registration_end TEXT,
      announcement_date TEXT,
      is_announcement_published INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      action TEXT NOT NULL,
      target_id TEXT,
      details TEXT,
      ip_address TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
