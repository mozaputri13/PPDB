import { db, initDatabase } from './database.js';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

export async function seedInitialData() {
  initDatabase();

  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) {
    return; // Already seeded
  }

  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash('password123', salt);

  // 1. Seed Users
  const adminId = 'admin-001';
  const studentId = 'user-001';

  db.prepare(`
    INSERT INTO users (id, nisn, email, nama, password_hash, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    adminId,
    null,
    'panitia.ppdb@smpn1harapan.sch.id',
    'Drs. H. Syamsul Huda, M.Pd.',
    defaultPasswordHash,
    'admin'
  );

  db.prepare(`
    INSERT INTO users (id, nisn, email, nama, password_hash, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    studentId,
    '0098765432',
    'rayhan.pratama@gmail.com',
    'Muhammad Rayhan Pratama',
    defaultPasswordHash,
    'student'
  );

  // 2. Seed PPDB Settings
  db.prepare(`
    INSERT INTO ppdb_settings (id, academic_year, quota_total, quota_reguler, quota_prestasi, quota_afirmasi, registration_start, registration_end, announcement_date, is_announcement_published)
    VALUES (1, '2026/2027', 216, 130, 50, 36, '1 Mei 2026', '30 Juni 2026', '5 Juli 2026', 0)
  `).run();

  // 3. Seed Realistic Applicants (covering PRD statuses)
  const seedApplicants = [
    {
      id: 'PPDB-2026-00412',
      userId: studentId,
      jalur: 'Reguler',
      status: 'Under Review',
      revisiNotes: '',
      nik: '3201123456780001',
      nama: 'Muhammad Rayhan Pratama',
      tempatLahir: 'Jakarta',
      tanggalLahir: '2013-05-14',
      jenisKelamin: 'Laki-laki',
      agama: 'Islam',
      alamat: 'Jl. Melati No. 15, RT 02/RW 04, Kelurahan Harapan Jaya',
      namaAyah: 'Ahmad Pratama',
      pekerjaanAyah: 'Wiraswasta',
      namaIbu: 'Siti Rahayu',
      pekerjaanIbu: 'Guru SD',
      whatsapp: '081298765432',
      sekolahAsal: 'MIN 1 Kota Mandiri',
      npsn: '60102030',
      tahunLulus: '2026',
      nilai: 91.45
    },
    {
      id: 'PPDB-2026-00411',
      userId: crypto.randomUUID(),
      jalur: 'Reguler',
      status: 'Needs Revision',
      revisiNotes: 'Foto scan Kartu Keluarga pada bagian NIK Orang Tua terpotong dan agak buram. Mohon unggah ulang berkas KK yang lebih jelas dan utuh.',
      nik: '3201123456780002',
      nama: 'Aisyah Nur Rahmah',
      tempatLahir: 'Bandung',
      tanggalLahir: '2013-08-20',
      jenisKelamin: 'Perempuan',
      agama: 'Islam',
      alamat: 'Jl. Mawar No. 8, RT 01/RW 02',
      namaAyah: 'Hasan Basri',
      pekerjaanAyah: 'Karyawan Swasta',
      namaIbu: 'Fatimah Az-Zahra',
      pekerjaanIbu: 'Ibu Rumah Tangga',
      whatsapp: '081345678901',
      sekolahAsal: 'SDN 02 Pagi Harapan',
      npsn: '60102031',
      tahunLulus: '2026',
      nilai: 88.75
    },
    {
      id: 'PPDB-2026-00410',
      userId: crypto.randomUUID(),
      jalur: 'Reguler',
      status: 'Verified',
      revisiNotes: '',
      nik: '3201123456780003',
      nama: 'Fahri Ahmad Zaki',
      tempatLahir: 'Bekasi',
      tanggalLahir: '2012-11-03',
      jenisKelamin: 'Laki-laki',
      agama: 'Islam',
      alamat: 'Komplek Permata Indah Blok C3 No. 12',
      namaAyah: 'Zainal Abidin',
      pekerjaanAyah: 'PNS',
      namaIbu: 'Mariana',
      pekerjaanIbu: 'Karyawan Swasta',
      whatsapp: '085712345678',
      sekolahAsal: 'SD IT Insan Cendekia',
      npsn: '60102032',
      tahunLulus: '2026',
      nilai: 88.10
    },
    {
      id: 'PPDB-2026-00409',
      userId: crypto.randomUUID(),
      jalur: 'Prestasi',
      status: 'Accepted',
      revisiNotes: '',
      nik: '3201123456780004',
      nama: 'Nabila Shafa Putri',
      tempatLahir: 'Tangerang',
      tanggalLahir: '2013-02-17',
      jenisKelamin: 'Perempuan',
      agama: 'Islam',
      alamat: 'Jl. Kenanga No. 22',
      namaAyah: 'Dedi Kusuma',
      pekerjaanAyah: 'Wiraswasta',
      namaIbu: 'Nurhasanah',
      pekerjaanIbu: 'Wiraswasta',
      whatsapp: '081987654321',
      sekolahAsal: 'SDN 10 Cempaka',
      npsn: '60102033',
      tahunLulus: '2026',
      nilai: 89.80
    },
    {
      id: 'PPDB-2026-00408',
      userId: crypto.randomUUID(),
      jalur: 'Afirmasi',
      status: 'Submitted',
      revisiNotes: '',
      nik: '3201123456780005',
      nama: 'Budi Santoso',
      tempatLahir: 'Jakarta',
      tanggalLahir: '2013-04-10',
      jenisKelamin: 'Laki-laki',
      agama: 'Islam',
      alamat: 'Jl. Anggrek No. 5',
      namaAyah: 'Bambang Santoso',
      pekerjaanAyah: 'Buruh Harian',
      namaIbu: 'Supartini',
      pekerjaanIbu: 'Pedagang',
      whatsapp: '088123456789',
      sekolahAsal: 'SDN 01 Harapan',
      npsn: '60102034',
      tahunLulus: '2026',
      nilai: 82.50
    },
    {
      id: 'PPDB-2026-00407',
      userId: crypto.randomUUID(),
      jalur: 'Reguler',
      status: 'Not Accepted',
      revisiNotes: '',
      nik: '3201123456780006',
      nama: 'Citra Dewi Lestari',
      tempatLahir: 'Bogor',
      tanggalLahir: '2013-09-01',
      jenisKelamin: 'Perempuan',
      agama: 'Kristen',
      alamat: 'Jl. Flamboyan No. 19',
      namaAyah: 'Yohanes Lestari',
      pekerjaanAyah: 'PNS',
      namaIbu: 'Maria Susanti',
      pekerjaanIbu: 'Apoteker',
      whatsapp: '081234509876',
      sekolahAsal: 'SDK Budi Mulia',
      npsn: '60102035',
      tahunLulus: '2026',
      nilai: 76.20
    }
  ];

  for (const app of seedApplicants) {
    if (app.userId !== studentId) {
      db.prepare(`
        INSERT OR IGNORE INTO users (id, nisn, email, nama, password_hash, role)
        VALUES (?, ?, ?, ?, ?, 'student')
      `).run(app.userId, `009${Math.floor(1000000 + Math.random() * 9000000)}`, `${app.nama.toLowerCase().replace(/\s+/g, '')}@gmail.com`, app.nama, defaultPasswordHash);
    }

    db.prepare(`
      INSERT INTO registrations (id, user_id, jalur, status, revisi_notes, submitted_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(app.id, app.userId, app.jalur, app.status, app.revisiNotes);

    db.prepare(`
      INSERT INTO student_profiles (id, registration_id, nik, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, alamat_lengkap)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(crypto.randomUUID(), app.id, app.nik, app.nama, app.tempatLahir, app.tanggalLahir, app.jenisKelamin, app.agama, app.alamat);

    db.prepare(`
      INSERT INTO parent_profiles (id, registration_id, nama_ayah, pekerjaan_ayah, nama_ibu, pekerjaan_ibu, no_whatsapp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(crypto.randomUUID(), app.id, app.namaAyah, app.pekerjaanAyah, app.namaIbu, app.pekerjaanIbu, app.whatsapp);

    db.prepare(`
      INSERT INTO school_origins (id, registration_id, nama_sekolah, npsn, tahun_lulus, nilai_rata_rata)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(crypto.randomUUID(), app.id, app.sekolahAsal, app.npsn, app.tahunLulus, app.nilai);

    // Documents
    const docTypes = ['kk', 'akta', 'pasfoto', 'skl'];
    for (const dt of docTypes) {
      db.prepare(`
        INSERT INTO uploaded_documents (id, registration_id, document_type, file_path, file_name, file_size, mime_type, is_verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        crypto.randomUUID(),
        app.id,
        dt,
        `storage/documents/${app.id}_${dt}.pdf`,
        `${dt.toUpperCase()}_${app.nama.replace(/\s+/g, '_')}.pdf`,
        Math.floor(400000 + Math.random() * 800000),
        'application/pdf',
        app.status === 'Verified' || app.status === 'Accepted' ? 1 : 0
      );
    }
  }

  console.log('Database PPDB berhasil diinisialisasi dan diisi data awal!');
}
