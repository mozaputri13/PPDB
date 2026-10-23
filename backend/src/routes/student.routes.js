import express from 'express';
import crypto from 'node:crypto';
import { db } from '../db/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { uploadDocument } from '../middleware/upload.js';

const router = express.Router();

router.use(authenticate);
router.use(requireRole('student'));

// Helper to get active registration for student
function getStudentRegistration(userId) {
  return db.prepare('SELECT * FROM registrations WHERE user_id = ?').get(userId);
}

// GET /api/student/registration
router.get('/registration', (req, res) => {
  try {
    const reg = getStudentRegistration(req.user.id);
    if (!reg) {
      return res.status(404).json({ error: 'Data pendaftaran tidak ditemukan.' });
    }

    const studentProfile = db.prepare('SELECT * FROM student_profiles WHERE registration_id = ?').get(reg.id) || {};
    const parentProfile = db.prepare('SELECT * FROM parent_profiles WHERE registration_id = ?').get(reg.id) || {};
    const schoolOrigin = db.prepare('SELECT * FROM school_origins WHERE registration_id = ?').get(reg.id) || {};
    const docs = db.prepare('SELECT id, document_type, file_name, file_size, mime_type, is_verified, created_at FROM uploaded_documents WHERE registration_id = ?').all(reg.id);

    // Group documents by type
    const docMap = {
      kk: null,
      akta: null,
      pasfoto: null,
      skl: null
    };

    for (const d of docs) {
      docMap[d.document_type] = {
        id: d.id,
        name: d.file_name,
        size: d.file_size > 1024 * 1024 ? `${(d.file_size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(d.file_size / 1024)} KB`,
        uploaded: true,
        isVerified: d.is_verified === 1
      };
    }

    res.json({
      registration: {
        id: reg.id,
        nisn: req.user.nisn,
        jalur: reg.jalur,
        status: reg.status,
        revisiNotes: reg.revisi_notes,
        submittedAt: reg.submitted_at,
        studentProfile,
        parentProfile,
        schoolOrigin,
        documents: docMap
      }
    });
  } catch (err) {
    console.error('Get registration error:', err);
    res.status(500).json({ error: 'Gagal memuat data pendaftaran.' });
  }
});

// PUT /api/student/registration (Update Isian Formulir)
router.put('/registration', (req, res) => {
  try {
    const reg = getStudentRegistration(req.user.id);
    if (!reg) {
      return res.status(404).json({ error: 'Data pendaftaran tidak ditemukan.' });
    }

    // Business rule: Form can only be edited when Draft or Needs Revision
    if (reg.status !== 'Draft' && reg.status !== 'Needs Revision') {
      return res.status(403).json({
        error: `Formulir tidak dapat diubah karena status pendaftaran saat ini adalah "${reg.status}".`
      });
    }

    const {
      jalur,
      nik,
      nama,
      tempatLahir,
      tanggalLahir,
      jenisKelamin,
      agama,
      alamat,
      namaAyah,
      pekerjaanAyah,
      namaIbu,
      pekerjaanIbu,
      whatsappOrtu,
      sekolahAsal,
      npsnAsal,
      tahunLulus,
      nilaiRataRata
    } = req.body;

    // 1. Update registration jalur
    if (jalur) {
      db.prepare('UPDATE registrations SET jalur = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(jalur, reg.id);
    }

    // 2. Upsert Student Profile
    const existingStudent = db.prepare('SELECT id FROM student_profiles WHERE registration_id = ?').get(reg.id);
    if (existingStudent) {
      db.prepare(`
        UPDATE student_profiles
        SET nik = ?, nama_lengkap = ?, tempat_lahir = ?, tanggal_lahir = ?, jenis_kelamin = ?, agama = ?, alamat_lengkap = ?
        WHERE registration_id = ?
      `).run(nik || '', nama || req.user.nama, tempatLahir || '', tanggalLahir || '', jenisKelamin || 'Laki-laki', agama || 'Islam', alamat || '', reg.id);
    } else {
      db.prepare(`
        INSERT INTO student_profiles (id, registration_id, nik, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, alamat_lengkap)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(crypto.randomUUID(), reg.id, nik || '', nama || req.user.nama, tempatLahir || '', tanggalLahir || '', jenisKelamin || 'Laki-laki', agama || 'Islam', alamat || '');
    }

    // 3. Upsert Parent Profile
    const existingParent = db.prepare('SELECT id FROM parent_profiles WHERE registration_id = ?').get(reg.id);
    if (existingParent) {
      db.prepare(`
        UPDATE parent_profiles
        SET nama_ayah = ?, pekerjaan_ayah = ?, nama_ibu = ?, pekerjaan_ibu = ?, no_whatsapp = ?
        WHERE registration_id = ?
      `).run(namaAyah || '', pekerjaanAyah || '', namaIbu || '', pekerjaanIbu || '', whatsappOrtu || '', reg.id);
    } else {
      db.prepare(`
        INSERT INTO parent_profiles (id, registration_id, nama_ayah, pekerjaan_ayah, nama_ibu, pekerjaan_ibu, no_whatsapp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(crypto.randomUUID(), reg.id, namaAyah || '', pekerjaanAyah || '', namaIbu || '', pekerjaanIbu || '', whatsappOrtu || '');
    }

    // 4. Upsert School Origin
    const existingSchool = db.prepare('SELECT id FROM school_origins WHERE registration_id = ?').get(reg.id);
    if (existingSchool) {
      db.prepare(`
        UPDATE school_origins
        SET nama_sekolah = ?, npsn = ?, tahun_lulus = ?, nilai_rata_rata = ?
        WHERE registration_id = ?
      `).run(sekolahAsal || '', npsnAsal || '', tahunLulus || '2026', parseFloat(nilaiRataRata) || 0.0, reg.id);
    } else {
      db.prepare(`
        INSERT INTO school_origins (id, registration_id, nama_sekolah, npsn, tahun_lulus, nilai_rata_rata)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(crypto.randomUUID(), reg.id, sekolahAsal || '', npsnAsal || '', tahunLulus || '2026', parseFloat(nilaiRataRata) || 0.0);
    }

    res.json({ message: 'Formulir berhasil disimpan.' });
  } catch (err) {
    console.error('Update registration error:', err);
    res.status(500).json({ error: 'Gagal memperbarui formulir pendaftaran.' });
  }
});

// POST /api/student/submit (Finalisasi Pengiriman Pendaftaran)
router.post('/submit', (req, res) => {
  try {
    const reg = getStudentRegistration(req.user.id);
    if (!reg) {
      return res.status(404).json({ error: 'Data pendaftaran tidak ditemukan.' });
    }

    if (reg.status !== 'Draft' && reg.status !== 'Needs Revision') {
      return res.status(400).json({ error: `Pendaftaran sudah dikirim sebelumnya (status saat ini: ${reg.status}).` });
    }

    // Verify all 4 documents uploaded
    const docCount = db.prepare(`
      SELECT COUNT(DISTINCT document_type) as count
      FROM uploaded_documents
      WHERE registration_id = ?
    `).get(reg.id).count;

    if (docCount < 4) {
      return res.status(400).json({
        error: `Seluruh 4 berkas wajib diunggah sebelum pengiriman final (saat ini terunggah: ${docCount} dari 4 berkas).`
      });
    }

    db.prepare(`
      UPDATE registrations
      SET status = 'Submitted', submitted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(reg.id);

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (user_id, action, target_id, details, ip_address)
      VALUES (?, 'SUBMIT_REGISTRATION', ?, 'Pendaftaran berhasil dikirim oleh siswa', ?)
    `).run(req.user.id, reg.id, req.ip);

    res.json({ message: 'Pendaftaran berhasil dikirim ke Panitia PPDB.', status: 'Submitted' });
  } catch (err) {
    console.error('Submit registration error:', err);
    res.status(500).json({ error: 'Gagal mengirim pendaftaran.' });
  }
});

// POST /api/student/upload (Unggah Berkas Persyaratan)
router.post('/upload', uploadDocument.single('file'), (req, res) => {
  try {
    const reg = getStudentRegistration(req.user.id);
    if (!reg) {
      return res.status(404).json({ error: 'Data pendaftaran tidak ditemukan.' });
    }

    if (reg.status !== 'Draft' && reg.status !== 'Needs Revision') {
      return res.status(403).json({ error: 'Unggah berkas tidak diizinkan pada status saat ini.' });
    }

    const { documentType } = req.body;
    if (!['kk', 'akta', 'pasfoto', 'skl'].includes(documentType)) {
      return res.status(400).json({ error: 'Tipe dokumen tidak valid (harus: kk, akta, pasfoto, atau skl).' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Berkas tidak ditemukan dalam permintaan.' });
    }

    // Delete previous record if exists
    db.prepare('DELETE FROM uploaded_documents WHERE registration_id = ? AND document_type = ?').run(reg.id, documentType);

    // Insert new document row
    const docId = crypto.randomUUID();
    db.prepare(`
      INSERT INTO uploaded_documents (id, registration_id, document_type, file_path, file_name, file_size, mime_type)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      docId,
      reg.id,
      documentType,
      req.file.filename,
      req.file.originalname,
      req.file.size,
      req.file.mimetype
    );

    res.json({
      message: `Berkas ${documentType.toUpperCase()} berhasil diunggah.`,
      document: {
        id: docId,
        documentType,
        fileName: req.file.originalname,
        fileSize: req.file.size
      }
    });
  } catch (err) {
    console.error('Upload document error:', err);
    res.status(500).json({ error: err.message || 'Gagal mengunggah berkas.' });
  }
});

export default router;
