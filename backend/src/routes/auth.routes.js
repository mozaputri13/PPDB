import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { db } from '../db/database.js';
import { authenticate, JWT_SECRET } from '../middleware/auth.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

const authLimiter = rateLimiter({
  maxAttempts: 15,
  windowMs: 15 * 60 * 1000,
  message: 'Terlalu banyak percobaan autentikasi. Demi keamanan, akun Anda dibatasi sementara. Coba lagi dalam 15 menit.'
});

// POST /api/auth/register (Registrasi Akun Siswa Baru)
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { nisn, nama, email, password } = req.body;

    if (!nisn || !/^\d{10}$/.test(nisn)) {
      return res.status(400).json({ error: 'NISN wajib terdiri dari 10 digit angka resmi.' });
    }
    if (!nama || !email || !password) {
      return res.status(400).json({ error: 'Semua field wajib diisi lengkap.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Kata sandi minimal 6 karakter.' });
    }

    // Check duplicate NISN or Email
    const existing = db.prepare('SELECT id FROM users WHERE nisn = ? OR email = ?').get(nisn, email);
    if (existing) {
      return res.status(409).json({ error: 'NISN atau Email sudah terdaftar. Silakan masuk menggunakan akun tersebut.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = crypto.randomUUID();

    // Insert user
    db.prepare(`
      INSERT INTO users (id, nisn, email, nama, password_hash, role)
      VALUES (?, ?, ?, ?, ?, 'student')
    `).run(userId, nisn, email, nama, passwordHash);

    // Create initial registration draft
    const regId = `PPDB-2026-${String(Math.floor(400 + Math.random() * 599)).padStart(5, '0')}`;
    db.prepare(`
      INSERT INTO registrations (id, user_id, jalur, status)
      VALUES (?, ?, 'Reguler', 'Draft')
    `).run(regId, userId);

    // Initial student profile
    db.prepare(`
      INSERT INTO student_profiles (id, registration_id, nik, nama_lengkap)
      VALUES (?, ?, '', ?)
    `).run(crypto.randomUUID(), regId, nama);

    // Sign JWT
    const token = jwt.sign({ id: userId, role: 'student' }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registrasi berhasil.',
      token,
      user: {
        id: userId,
        nisn,
        email,
        nama,
        role: 'student',
        registrationId: regId
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server saat registrasi.' });
  }
});

// POST /api/auth/login (Login Siswa atau Panitia)
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or nisn

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/NISN dan kata sandi wajib diisi.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ? OR nisn = ?').get(identifier, identifier);
    if (!user) {
      return res.status(401).json({ error: 'Email, NISN, atau kata sandi tidak sesuai.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email, NISN, atau kata sandi tidak sesuai.' });
    }

    let registrationId = null;
    if (user.role === 'student') {
      const reg = db.prepare('SELECT id FROM registrations WHERE user_id = ?').get(user.id);
      if (reg) registrationId = reg.id;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login berhasil.',
      token,
      user: {
        id: user.id,
        nisn: user.nisn,
        email: user.email,
        nama: user.nama,
        role: user.role,
        registrationId
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server saat proses login.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  let registrationId = null;
  if (req.user.role === 'student') {
    const reg = db.prepare('SELECT id FROM registrations WHERE user_id = ?').get(req.user.id);
    if (reg) registrationId = reg.id;
  }

  res.json({
    user: {
      id: req.user.id,
      nisn: req.user.nisn,
      email: req.user.email,
      nama: req.user.nama,
      role: req.user.role,
      registrationId
    }
  });
});

export default router;
