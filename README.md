# PPDB SOT — Sistem Informasi PPDB MTs/SMP

Folder ini berisi dokumen sumber kebenaran (Source of Truth/SOT), aturan agen, rencana implementasi, preview, dan prompt eksekusi untuk proyek Sistem Informasi Penerimaan Peserta Didik Baru (PPDB) berbasis web.

## Isi folder
- `docs/PRD.md` — kebutuhan produk dan ruang lingkup.
- `docs/UI-GUIDELINE.md` — pedoman visual dan pengalaman pengguna.
- `docs/IMPLEMENTATION_PLAN.md` — tahapan implementasi dan gerbang persetujuan.
- `docs/WIREFRAME_SPEC.md` — spesifikasi inventaris wireframe (Fase 1).
- `docs/BACKEND_ARCHITECTURE.md` — rencana arsitektur backend, skema data, & keamanan (Fase 3).
- `docs/DEPLOYMENT_GUIDE.md` — panduan instalasi, deployment produksi (Nginx/PM2), backup, & pemulihan (Fase 5).
- `docs/RELEASE_NOTES.md` — catatan rilis resmi v1.0.0, ringkasan fitur, hasil QA, & akun demo.
- `AGENTS.md` — aturan kerja agen AI/developer.
- `PROMPT_EXECUTION.md` — cara menjalankan prompt secara bertahap.
- `preview/index.html` — preview visual statis awal.
- `preview/wireframe.html` — wireframe interaktif lengkap (Fase 1).
- `frontend/` — aplikasi front-end React + Vite dengan ErrorBoundary & tokens (Fase 2 & Fase 5).
- `backend/` — server backend Express.js + SQLite native + JWT + Multer + RateLimiter (Fase 4 & Fase 5).
- `prompts/` — prompt siap salin untuk tiap fase (Prompt 0 s/d Prompt 5).

## Aturan penting
1. Dokumen SOT utama hanya `PRD.md`, `UI-GUIDELINE.md`, dan `IMPLEMENTATION_PLAN.md`.
2. Setiap fase wajib berhenti dan meminta persetujuan pengguna sebelum melanjutkan fase berikutnya.
3. Jangan menambah fitur di luar PRD tanpa persetujuan.
4. Fitur-fitur saat ini telah terintegrasi dengan backend database lokal SQLite dan storage privat dokumen.
5. Kerahasiaan data kependudukan pendaftar (NIK, KK, Akta) dilindungi otorisasi server (UU PDP).

## Cara melihat & menjalankan aplikasi terintegrasi
1. **Jalankan Server Backend (Terminal 1)**:
   ```bash
   cd backend
   npm start
   ```
   Server backend akan aktif di `http://localhost:3001`.
2. **Jalankan Front-End React + Vite (Terminal 2)**:
   ```bash
   cd frontend
   npm run dev
   ```
   Buka peramban di `http://localhost:5173`.
3. **Menjalankan Seluruh Pengujian Otomatis (UAT & Integration)**:
   ```bash
   cd backend
   node test_uat_phase5.js      # 25 test case UAT & Hardening (Fase 5)
   node test_integration.js     # 18 test case integrasi end-to-end (Fase 4)
   ```

## Cara menggunakan dengan AI coding agent
1. Berikan `README.md`, `AGENTS.md`, dan tiga dokumen SOT sebagai konteks.
2. Jalankan prompt yang sesuai dari `prompts/` atau ikuti `PROMPT_EXECUTION.md`.
3. Minta agen mengerjakan hanya fase yang sedang disetujui.
4. Review hasil dan beri persetujuan eksplisit sebelum fase berikutnya.
