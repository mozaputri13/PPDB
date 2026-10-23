import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { seedInitialData } from './db/seed.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/student.routes.js';
import adminRoutes from './routes/admin.routes.js';
import documentRoutes from './routes/document.routes.js';
import publicRoutes from './routes/public.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true
}));

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    time: new Date().toISOString(), 
    service: 'PPDB Backend API',
    version: '1.0.0-phase5' 
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/public', publicRoutes);

// 404 handler untuk endpoint tak dikenal
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint API tidak ditemukan.' });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error ${req.method} ${req.originalUrl}:`, err.message);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Ukuran berkas melebihi batas maksimal 2 MB.' });
  }

  // Lindungi agar detail stack trace tidak bocor ke client di mode non-development
  const message = err.status && err.status < 500 
    ? err.message 
    : 'Terjadi kesalahan sistem internal pada server PPDB. Silakan hubungi panitia jika kendala berlanjut.';

  res.status(err.status || 500).json({ error: message });
});

// Start server
async function start() {
  try {
    await seedInitialData();
    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 PPDB Backend Server berjalan di http://localhost:${PORT}`);
      console.log(`📡 API Endpoints tersedia pada http://localhost:${PORT}/api`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    console.error('Gagal menjalankan server:', err);
    process.exit(1);
  }
}

start();
