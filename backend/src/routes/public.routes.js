import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// GET /api/public/info
router.get('/info', (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM ppdb_settings WHERE id = 1').get() || {};
    res.json({
      school: {
        name: 'MTs / SMP Negeri 1 Harapan Bangsa',
        academicYear: settings.academic_year || '2026/2027',
        address: 'Jl. Pendidikan No. 45, Harapan Jaya, Kota Mandiri',
        phone: '(021) 555-0199',
        email: 'ppdb@smpn1harapan.sch.id',
        schedule: {
          start: settings.registration_start || '1 Mei 2026',
          end: settings.registration_end || '30 Juni 2026',
          announcementDate: settings.announcement_date || '5 Juli 2026'
        },
        quota: {
          total: settings.quota_total || 216,
          reguler: settings.quota_reguler || 130,
          prestasi: settings.quota_prestasi || 50,
          afirmasi: settings.quota_afirmasi || 36
        }
      }
    });
  } catch (err) {
    console.error('Public info error:', err);
    res.status(500).json({ error: 'Gagal memuat informasi publik.' });
  }
});

// GET /api/public/announcement
router.get('/announcement', (req, res) => {
  try {
    const settings = db.prepare('SELECT is_announcement_published FROM ppdb_settings WHERE id = 1').get();
    const isPublished = settings && settings.is_announcement_published === 1;

    if (!isPublished) {
      return res.json({
        isPublished: false,
        message: 'Pengumuman resmi kelulusan PPDB belum diterbitkan oleh panitia.'
      });
    }

    // Only return non-sensitive public data: No NIK, No Parent Data, No Phone Numbers!
    const acceptedList = db.prepare(`
      SELECT 
        r.id as no_pendaftaran,
        substr(u.nisn, 1, 6) || '****' as nisn_masked,
        sp.nama_lengkap,
        so.nama_sekolah as sekolah_asal,
        r.jalur
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      JOIN student_profiles sp ON r.id = sp.registration_id
      JOIN school_origins so ON r.id = so.registration_id
      WHERE r.status = 'Accepted'
      ORDER BY so.nilai_rata_rata DESC
    `).all();

    res.json({
      isPublished: true,
      acceptedCount: acceptedList.length,
      applicants: acceptedList
    });
  } catch (err) {
    console.error('Public announcement error:', err);
    res.status(500).json({ error: 'Gagal memuat pengumuman publik.' });
  }
});

export default router;
