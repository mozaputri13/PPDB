import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'ppdb-sot-secret-key-2026-safe-dev';

export function authenticate(req, res, next) {
  let token = null;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query && req.query.token) {
    // For direct document download links
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Akses ditolak: Token autentikasi tidak ditemukan.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT id, nisn, email, nama, role, is_active FROM users WHERE id = ?').get(decoded.id);

    if (!user || user.is_active !== 1) {
      return res.status(401).json({ error: 'Sesi tidak valid atau akun dinonaktifkan.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Sesi telah kedaluwarsa atau token tidak valid. Silakan masuk kembali.' });
  }
}

export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Autentikasi diperlukan.' });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Akses dilarang: Peran Anda tidak memiliki hak akses ke modul ini.' });
    }

    next();
  };
}
