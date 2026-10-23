import express from 'express';
import { db } from '../db/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(requireRole('admin'));

// GET /api/admin/metrics
router.get('/metrics', (req, res) => {
  try {
    const total = db.prepare('SELECT COUNT(*) as c FROM registrations').get().c;
    const underReview = db.prepare("SELECT COUNT(*) as c FROM registrations WHERE status IN ('Under Review', 'Submitted')").get().c;
    const needsRevision = db.prepare("SELECT COUNT(*) as c FROM registrations WHERE status = 'Needs Revision'").get().c;
    const verified = db.prepare("SELECT COUNT(*) as c FROM registrations WHERE status = 'Verified'").get().c;
    const accepted = db.prepare("SELECT COUNT(*) as c FROM registrations WHERE status = 'Accepted'").get().c;

    const settings = db.prepare('SELECT * FROM ppdb_settings WHERE id = 1').get() || {};

    res.json({
      metrics: {
        total,
        underReview,
        needsRevision,
        verified,
        accepted,
        quotaTotal: settings.quota_total || 216,
        isAnnouncementPublished: settings.is_announcement_published === 1
      }
    });
  } catch (err) {
    console.error('Metrics error:', err);
    res.status(500).json({ error: 'Gagal memuat statistik admin.' });
  }
});

// GET /api/admin/applicants (Tabel Master Pendaftar)
router.get('/applicants', (req, res) => {
  try {
    const { search, status, jalur } = req.query;

    let query = `
      SELECT 
        r.id, r.jalur, r.status, r.revisi_notes, r.submitted_at,
        u.nisn, u.email,
        sp.nama_lengkap as nama, sp.jenis_kelamin as jenisKelamin,
        so.nama_sekolah as sekolahAsal, so.nilai_rata_rata as nilaiRataRata
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN student_profiles sp ON r.id = sp.registration_id
      LEFT JOIN school_origins so ON r.id = so.registration_id
      WHERE 1=1
    `;

    const params = [];

    if (search) {
      query += ` AND (sp.nama_lengkap LIKE ? OR u.nisn LIKE ? OR r.id LIKE ? OR so.nama_sekolah LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (status && status !== 'ALL') {
      query += ` AND r.status = ?`;
      params.push(status);
    }

    if (jalur && jalur !== 'ALL') {
      query += ` AND r.jalur = ?`;
      params.push(jalur);
    }

    query += ` ORDER BY so.nilai_rata_rata DESC, r.created_at DESC`;

    const applicants = db.prepare(query).all(...params);
    res.json({ applicants });
  } catch (err) {
    console.error('Applicants query error:', err);
    res.status(500).json({ error: 'Gagal mengambil data pendaftar.' });
  }
});

// GET /api/admin/applicants/:id (Detail Lengkap untuk Verifikasi)
router.get('/applicants/:id', (req, res) => {
  try {
    const reg = db.prepare(`
      SELECT r.*, u.nisn, u.email
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `).get(req.params.id);

    if (!reg) {
      return res.status(404).json({ error: 'Pendaftar tidak ditemukan.' });
    }

    const studentProfile = db.prepare('SELECT * FROM student_profiles WHERE registration_id = ?').get(reg.id) || {};
    const parentProfile = db.prepare('SELECT * FROM parent_profiles WHERE registration_id = ?').get(reg.id) || {};
    const schoolOrigin = db.prepare('SELECT * FROM school_origins WHERE registration_id = ?').get(reg.id) || {};
    const documents = db.prepare('SELECT id, document_type, file_name, file_size, mime_type, is_verified, created_at FROM uploaded_documents WHERE registration_id = ?').all(reg.id);

    const docMap = { kk: null, akta: null, pasfoto: null, skl: null };
    for (const d of documents) {
      docMap[d.document_type] = {
        id: d.id,
        name: d.file_name,
        size: d.file_size > 1024 * 1024 ? `${(d.file_size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(d.file_size / 1024)} KB`,
        uploaded: true,
        isVerified: d.is_verified === 1
      };
    }

    res.json({
      applicant: {
        id: reg.id,
        nisn: reg.nisn,
        email: reg.email,
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
    console.error('Applicant detail error:', err);
    res.status(500).json({ error: 'Gagal mengambil detail pendaftar.' });
  }
});

// PUT /api/admin/applicants/:id/verify (Setujui Berkas)
router.put('/applicants/:id/verify', (req, res) => {
  try {
    db.prepare(`
      UPDATE registrations
      SET status = 'Verified', verified_by = ?, verified_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(req.user.id, req.params.id);

    db.prepare(`
      INSERT INTO audit_logs (user_id, action, target_id, details, ip_address)
      VALUES (?, 'VERIFY_APPLICANT', ?, 'Berkas disetujui oleh verifikator', ?)
    `).run(req.user.id, req.params.id, req.ip);

    res.json({ message: `Pendaftaran ${req.params.id} berhasil diverifikasi.`, status: 'Verified' });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ error: 'Gagal memverifikasi pendaftaran.' });
  }
});

// PUT /api/admin/applicants/:id/revision (Minta Perbaikan / Revisi Berkas)
router.put('/applicants/:id/revision', (req, res) => {
  try {
    const { note } = req.body;
    if (!note || !note.trim()) {
      return res.status(400).json({ error: 'Catatan kendala berkas wajib disertakan.' });
    }

    db.prepare(`
      UPDATE registrations
      SET status = 'Needs Revision', revisi_notes = ?, verified_by = ?, verified_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(note.trim(), req.user.id, req.params.id);

    db.prepare(`
      INSERT INTO audit_logs (user_id, action, target_id, details, ip_address)
      VALUES (?, 'REQUEST_REVISION', ?, ?, ?)
    `).run(req.user.id, req.params.id, `Instruksi revisi: ${note.trim()}`, req.ip);

    res.json({ message: `Instruksi perbaikan berkas dikirim ke pendaftar ${req.params.id}.`, status: 'Needs Revision' });
  } catch (err) {
    console.error('Revision request error:', err);
    res.status(500).json({ error: 'Gagal mengirim instruksi perbaikan.' });
  }
});

// PUT /api/admin/applicants/:id/reject (Tolak Pendaftaran)
router.put('/applicants/:id/reject', (req, res) => {
  try {
    db.prepare(`
      UPDATE registrations
      SET status = 'Not Accepted', verified_by = ?, verified_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(req.user.id, req.params.id);

    db.prepare(`
      INSERT INTO audit_logs (user_id, action, target_id, details, ip_address)
      VALUES (?, 'REJECT_APPLICANT', ?, 'Pendaftaran ditolak', ?)
    `).run(req.user.id, req.params.id, req.ip);

    res.json({ message: `Pendaftaran ${req.params.id} ditolak.`, status: 'Not Accepted' });
  } catch (err) {
    console.error('Reject error:', err);
    res.status(500).json({ error: 'Gagal menolak pendaftaran.' });
  }
});

// PUT /api/admin/selection/:id (Tetapkan Kelulusan)
router.put('/selection/:id', (req, res) => {
  try {
    const { decision } = req.body;
    if (!['Accepted', 'Not Accepted'].includes(decision)) {
      return res.status(400).json({ error: 'Keputusan harus "Accepted" atau "Not Accepted".' });
    }

    db.prepare(`
      UPDATE registrations
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(decision, req.params.id);

    res.json({ message: `Keputusan seleksi ${req.params.id} ditetapkan: ${decision}.`, status: decision });
  } catch (err) {
    console.error('Selection decision error:', err);
    res.status(500).json({ error: 'Gagal menyimpan keputusan seleksi.' });
  }
});

// POST /api/admin/announcement/publish (Toggle Publikasi Pengumuman)
router.post('/announcement/publish', (req, res) => {
  try {
    const current = db.prepare('SELECT is_announcement_published FROM ppdb_settings WHERE id = 1').get();
    const nextVal = current && current.is_announcement_published === 1 ? 0 : 1;

    db.prepare('UPDATE ppdb_settings SET is_announcement_published = ? WHERE id = 1').run(nextVal);

    db.prepare(`
      INSERT INTO audit_logs (user_id, action, details, ip_address)
      VALUES (?, 'TOGGLE_ANNOUNCEMENT_PUBLISH', ?, ?)
    `).run(req.user.id, nextVal === 1 ? 'Pengumuman DITERBITKAN' : 'Pengumuman ditarik ke DRAFT', req.ip);

    res.json({
      message: nextVal === 1 ? 'Pengumuman resmi berhasil diterbitkan ke seluruh calon siswa.' : 'Pengumuman ditarik kembali ke DRAFT.',
      isAnnouncementPublished: nextVal === 1
    });
  } catch (err) {
    console.error('Toggle announcement error:', err);
    res.status(500).json({ error: 'Gagal mengubah status publikasi pengumuman.' });
  }
});

// GET /api/admin/reports/summary (Demografi)
router.get('/reports/summary', (req, res) => {
  try {
    const jalurCounts = db.prepare(`
      SELECT jalur, COUNT(*) as count
      FROM registrations
      GROUP BY jalur
    `).all();

    const genderCounts = db.prepare(`
      SELECT sp.jenis_kelamin as gender, COUNT(*) as count
      FROM registrations r
      JOIN student_profiles sp ON r.id = sp.registration_id
      GROUP BY sp.jenis_kelamin
    `).all();

    res.json({
      jalur: jalurCounts,
      gender: genderCounts
    });
  } catch (err) {
    console.error('Report summary error:', err);
    res.status(500).json({ error: 'Gagal mengambil ringkasan laporan.' });
  }
});

// GET /api/admin/reports/export-csv
router.get('/reports/export-csv', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT 
        r.id as no_pendaftaran,
        u.nisn,
        sp.nik,
        sp.nama_lengkap as nama_siswa,
        sp.jenis_kelamin,
        sp.tempat_lahir,
        sp.tanggal_lahir,
        pp.nama_ayah,
        pp.nama_ibu,
        pp.no_whatsapp,
        so.nama_sekolah as sekolah_asal,
        so.nilai_rata_rata as nilai_ujian,
        r.jalur,
        r.status
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN student_profiles sp ON r.id = sp.registration_id
      LEFT JOIN parent_profiles pp ON r.id = pp.registration_id
      LEFT JOIN school_origins so ON r.id = so.registration_id
      ORDER BY so.nilai_rata_rata DESC
    `).all();

    // Tambahkan UTF-8 BOM (\uFEFF) agar Microsoft Excel langsung membaca aksen & karakter secara presisi
    let csv = '\uFEFFNo. Pendaftaran,NISN,NIK,Nama Siswa,Gender,Tempat Lahir,Tgl Lahir,Nama Ayah,Nama Ibu,No WA,Sekolah Asal,Nilai,Jalur,Status\n';
    for (const r of rows) {
      csv += `"${r.no_pendaftaran}","${r.nisn || ''}","${r.nik || ''}","${r.nama_siswa || ''}","${r.jenis_kelamin || ''}","${r.tempat_lahir || ''}","${r.tanggal_lahir || ''}","${r.nama_ayah || ''}","${r.nama_ibu || ''}","${r.no_whatsapp || ''}","${r.sekolah_asal || ''}","${r.nilai_ujian || 0}","${r.jalur}","${r.status}"\n`;
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="Rekap_Pendaftar_PPDB_2026.csv"');
    res.send(csv);
  } catch (err) {
    console.error('Export CSV error:', err);
    res.status(500).json({ error: 'Gagal mengekspor data CSV.' });
  }
});

// GET /api/admin/reports/official-decree (Data SK & Rekapitulasi Kelulusan Resmi)
router.get('/reports/official-decree', (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM ppdb_settings WHERE id = 1').get() || {};

    const acceptedList = db.prepare(`
      SELECT 
        r.id as no_pendaftaran,
        u.nisn,
        sp.nama_lengkap as nama_siswa,
        sp.jenis_kelamin,
        r.jalur,
        so.nama_sekolah as sekolah_asal,
        so.nilai_rata_rata as nilai_ujian
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      JOIN student_profiles sp ON r.id = sp.registration_id
      JOIN school_origins so ON r.id = so.registration_id
      WHERE r.status = 'Accepted'
      ORDER BY so.nilai_rata_rata DESC
    `).all();

    const stats = {
      totalQuota: settings.quota_total || 216,
      totalAccepted: acceptedList.length,
      skNumber: '421.3 / 088 / PAN-PPDB / SMPN1 / 2026',
      academicYear: '2026 / 2027',
      schoolName: 'SMP NEGERI 1 HARAPAN',
      headmaster: {
        name: 'Drs. H. Ahmad Dahlan, M.Pd',
        nip: '19720514 199803 1 002'
      },
      committeeHead: {
        name: 'Hj. Siti Rahmawati, S.Pd',
        nip: '19800812 200501 2 004'
      },
      acceptedStudents: acceptedList
    };

    res.json(stats);
  } catch (err) {
    console.error('Official decree data error:', err);
    res.status(500).json({ error: 'Gagal memuat data ketetapan kelulusan.' });
  }
});

// GET /api/admin/reports/export-pdf (Halaman Resmi Siap Cetak / Save to PDF)
router.get('/reports/export-pdf', (req, res) => {
  try {
    const accepted = db.prepare(`
      SELECT 
        r.id as no_pendaftaran,
        u.nisn,
        sp.nama_lengkap as nama_siswa,
        sp.jenis_kelamin,
        r.jalur,
        so.nama_sekolah as sekolah_asal,
        so.nilai_rata_rata as nilai_ujian
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      JOIN student_profiles sp ON r.id = sp.registration_id
      JOIN school_origins so ON r.id = so.registration_id
      WHERE r.status = 'Accepted'
      ORDER BY so.nilai_rata_rata DESC
    `).all();

    const dateStr = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date());

    const tableRowsHtml = accepted.map((s, idx) => `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td style="font-family: monospace; font-weight: 600;">${s.no_pendaftaran}</td>
        <td style="font-family: monospace;">${s.nisn}</td>
        <td><strong>${s.nama_siswa}</strong></td>
        <td style="text-align: center;">${s.jenis_kelamin === 'Perempuan' ? 'P' : 'L'}</td>
        <td style="text-align: center;">${s.jalur}</td>
        <td style="text-align: center; font-weight: 700; color: #1e3a8a;">${Number(s.nilai_ujian).toFixed(2)}</td>
        <td>${s.sekolah_asal}</td>
      </tr>
    `).join('');

    const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan Rekapitulasi Kelulusan PPDB 2026 - SMP Negeri 1 Harapan</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      color: #111;
      margin: 0;
      padding: 20px;
      line-height: 1.4;
      background: #fff;
    }
    .header-kop {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      border-bottom: 3px double #000;
      padding-bottom: 12px;
      margin-bottom: 24px;
      text-align: center;
    }
    .kop-text h4 { margin: 0; font-size: 14pt; font-weight: normal; letter-spacing: 1px; }
    .kop-text h3 { margin: 0; font-size: 15pt; font-weight: normal; }
    .kop-text h2 { margin: 2px 0; font-size: 18pt; font-weight: bold; letter-spacing: 1.5px; }
    .kop-text p { margin: 0; font-size: 10pt; font-style: italic; }
    
    .document-title {
      text-align: center;
      margin-bottom: 20px;
    }
    .document-title h3 {
      margin: 0;
      font-size: 13pt;
      text-decoration: underline;
      font-weight: bold;
    }
    .document-title p {
      margin: 4px 0 0;
      font-size: 11pt;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      font-size: 10pt;
    }
    th, td {
      border: 1px solid #333;
      padding: 6px 8px;
    }
    th {
      background-color: #f1f5f9;
      font-weight: bold;
      text-align: center;
    }

    .meta-box {
      margin: 16px 0;
      font-size: 11pt;
    }
    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      page-break-inside: avoid;
    }
    .sig-box {
      text-align: center;
      width: 250px;
    }
    .sig-space {
      height: 70px;
    }
    .sig-name {
      font-weight: bold;
      text-decoration: underline;
    }
    .print-actions {
      text-align: center;
      margin-bottom: 25px;
    }
    @media print {
      .print-actions { display: none; }
      body { padding: 0; }
    }
    .btn-print {
      background: #1e3a8a;
      color: white;
      border: none;
      padding: 10px 22px;
      font-size: 14px;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
  </style>
</head>
<body>
  <div class="print-actions">
    <button class="btn-print" onclick="window.print()">🖨️ Cetak / Simpan sebagai PDF (A4)</button>
  </div>

  <div class="header-kop">
    <div class="kop-text">
      <h4>PEMERINTAH PROVINSI / KEMENTERIAN AGAMA</h4>
      <h3>DINAS PENDIDIKAN DAN KEBUDAYAAN</h3>
      <h2>SMP NEGERI 1 HARAPAN</h2>
      <p>Jl. Pendidikan Mandiri No. 45, Telp: (021) 8876543 | Laman: ppdb.smpn1harapan.sch.id</p>
    </div>
  </div>

  <div class="document-title">
    <h3>SURAT KEPUTUSAN PENETAPAN KELULUSAN PPDB</h3>
    <p>NOMOR: 421.3 / 088 / PAN-PPDB / SMPN1 / 2026</p>
  </div>

  <div class="meta-box">
    <p>Berdasarkan hasil verifikasi berkas administrasi dan pemeringkatan nilai seleksi Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027, Panitia menetapkan nama-nama calon peserta didik di bawah ini dinyatakan <strong>DITERIMA</strong>:</p>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 35px;">No.</th>
        <th style="width: 120px;">No. Pendaftaran</th>
        <th style="width: 100px;">NISN</th>
        <th>Nama Lengkap Calon Siswa</th>
        <th style="width: 35px;">L/P</th>
        <th style="width: 80px;">Jalur</th>
        <th style="width: 65px;">Nilai</th>
        <th>Asal Sekolah</th>
      </tr>
    </thead>
    <tbody>
      ${tableRowsHtml || '<tr><td colspan="8" style="text-align: center; padding: 20px;">Belum ada calon siswa dengan status diterima.</td></tr>'}
    </tbody>
  </table>

  <div class="signatures">
    <div class="sig-box">
      <p>Mengetahui,<br>Kepala SMP Negeri 1 Harapan</p>
      <div class="sig-space"></div>
      <p class="sig-name">Drs. H. Ahmad Dahlan, M.Pd</p>
      <p>NIP. 19720514 199803 1 002</p>
    </div>
    <div class="sig-box">
      <p>Ditetapkan di: Harapan Jaya<br>Pada Tanggal: ${dateStr}<br>Ketua Panitia PPDB</p>
      <div class="sig-space"></div>
      <p class="sig-name">Hj. Siti Rahmawati, S.Pd</p>
      <p>NIP. 19800812 200501 2 004</p>
    </div>
  </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    console.error('Export PDF error:', err);
    res.status(500).json({ error: 'Gagal mencetak laporan PDF.' });
  }
});

export default router;
