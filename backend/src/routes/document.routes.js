import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { db } from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// GET /api/documents/:id/download (Unduh/Pratinjau Dokumen Terproteksi)
router.get('/:id/download', authenticate, (req, res) => {
  try {
    const doc = db.prepare(`
      SELECT d.*, r.user_id
      FROM uploaded_documents d
      JOIN registrations r ON d.registration_id = r.id
      WHERE d.id = ?
    `).get(req.params.id);

    if (!doc) {
      return res.status(404).json({ error: 'Dokumen tidak ditemukan.' });
    }

    // Authorization check: Only Admin OR Owner Student can access
    const isOwner = req.user.role === 'student' && doc.user_id === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      // Security audit log for unauthorized attempt
      db.prepare(`
        INSERT INTO audit_logs (user_id, action, target_id, details, ip_address)
        VALUES (?, 'UNAUTHORIZED_DOC_ACCESS_BLOCKED', ?, 'Percobaan akses dokumen orang lain diblokir', ?)
      `).run(req.user.id, doc.id, req.ip);

      return res.status(403).json({
        error: 'Akses Ditolak: Dokumen pendaftar bersifat pribadi dan dilindungi ketentuan UU PDP.'
      });
    }

    const uploadDir = path.resolve(__dirname, '../../storage/documents');
    const filePath = path.join(uploadDir, path.basename(doc.file_path));

    // If actual file exists on disk, stream it
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', doc.mime_type);
      res.setHeader('Content-Disposition', `inline; filename="${doc.file_name}"`);
      return res.sendFile(filePath);
    }

    // Mock document placeholder response if seeded without physical file
    res.setHeader('Content-Type', doc.mime_type || 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${doc.file_name}"`);
    res.send(Buffer.from(`%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF\n`));
  } catch (err) {
    console.error('Download document error:', err);
    res.status(500).json({ error: 'Gagal mengunduh dokumen.' });
  }
});

export default router;
