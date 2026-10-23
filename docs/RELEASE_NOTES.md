# Catatan Rilis Resmi (Release Notes) — Sistem Informasi PPDB MTs/SMP v1.0.0

**Tanggal Rilis**: 23 Oktober 2026  
**Status**: Produksi Siap Pakai (*Production Ready*)  
**Kepatuhan Sumber Kebenaran**: 100% Mengikuti `docs/PRD.md`, `docs/UI-GUIDELINE.md`, dan `docs/IMPLEMENTATION_PLAN.md`.

---

## 1. Ikhtisar Rilis v1.0.0
Sistem Informasi Penerimaan Peserta Didik Baru (PPDB) Online berbasis web untuk jenjang SMP/MTs telah selesai dikembangkan melalui 6 tahapan fase terstruktur tanpa melompati gerbang persetujuan:
- **Fase 0**: SOT dan Fondasi Dokumen Sumber Kebenaran
- **Fase 1**: Validasi Struktur Produk & Wireframe Interaktif 8 Modul
- **Fase 2**: Front-end Foundation (React 19 + Vite 8 + Vanilla CSS Design Tokens)
- **Fase 3**: Perencanaan Arsitektur Data Model & Keamanan Backend
- **Fase 4**: Integrasi Penuh Front-End & Backend Express.js + SQLite Native + JWT + Multer
- **Fase 5**: Modul Laporan Resmi (PDF SK A4 & Excel/CSV UTF-8 BOM), Hardening Keamanan, Error Boundary, UAT, dan Panduan Deployment

---

## 2. Cakupan Fitur & Modul Utama (8 Modul Lengkap)

### A. Modul Calon Siswa (Pendaftar)
1. **Beranda Publik (`PublicHome`)**:
   - Informasi kuota daya tampung resmi (216 siswa).
   - Jadwal tahapan pendaftaran, pengumuman jalur masuk (Zonasi, Afirmasi, Prestasi, Perpindahan Tugas).
   - Pengumuman kelulusan resmi dengan fitur pencarian real-time dan **penyamaran NISN/NIK (UU PDP)**.
2. **Autentikasi & Akun Siswa (`AuthPage`)**:
   - Registrasi mandiri menggunakan NISN 10 digit, nama lengkap, email, dan kata sandi.
   - Login aman berbasis JWT dengan proteksi rate limiting anti-brute force.
3. **Formulir Pendaftaran Bertahap (`RegistrationForm`)**:
   - Alur pengisian terstruktur 5 langkah: (1) Jalur Masuk, (2) Data Diri Siswa, (3) Data Orang Tua/Wali, (4) Nilai & Asal Sekolah, (5) Unggah Berkas Persyaratan.
   - Validasi berkas: Format PDF, JPG, PNG, ukuran maksimal 2 MB, dan validasi kelengkapan 4 berkas wajib (KK, Akta Kelahiran, Pasfoto, SKL) sebelum finalisasi pendaftaran.
4. **Dashboard Status Siswa (`StudentDashboard`)**:
   - Pemantauan alur status pendaftaran dari 7 state resmi: `Draft` ➔ `Under Review` ➔ `Needs Revision` ➔ `Verified` ➔ `Reserve` ➔ `Accepted` / `Rejected`.
   - Menampilkan instruksi/catatan revisi spesifik dari panitia verifikator jika ada berkas yang kurang jelas.
   - Pengunduhan **Bukti Pendaftaran Resmi** siap cetak.

### B. Modul Panitia PPDB (Admin)
5. **Dashboard Ringkasan Admin (`AdminDashboard`)**:
   - Kartu metrik live: Total pendaftar, Menunggu Verifikasi, Perlu Revisi, Terverifikasi, Diterima, dan Kuota Tersisa.
   - Tabel pemantauan seluruh berkas calon siswa dengan pencarian instan dan filter status/jalur.
6. **Panel Verifikasi Berkas (`VerificationPanel`)**:
   - Peninjauan detail data siswa dan dokumen kependudukan secara aman via API berotorisasi token.
   - Fitur 1-klik persetujuan verifikasi (`Verified`) atau penolakan (`Rejected`).
   - Fitur pengiriman instruksi revisi berkas (`Needs Revision`) dengan input catatan perbaikan.
7. **Modul Seleksi & Kuota (`SelectionManager`)**:
   - Pemeringkatan pendaftar terverifikasi berdasarkan nilai ujian dan jalur masuk.
   - Penetapan kuota dan penetapan keputusan kelulusan (`Accepted`, `Reserve`, `Rejected`).
   - Kontrol penerbitan (*toggle publish*) pengumuman kelulusan resmi ke halaman publik.
8. **Laporan & Ekspor Data (`ReportsExport`)**:
   - Ekspor seluruh data master pendaftar ke format **Excel/CSV** dengan **UTF-8 BOM (`\uFEFF`)** untuk integritas karakter dan pemisahan kolom rapi di Microsoft Excel.
   - Cetak / Simpan **Laporan Rekapitulasi Kelulusan Resmi (PDF A4)** lengkap dengan Kop Surat Sekolah, Surat Keputusan (SK) Panitia, Tabel Pemeringkatan Siswa Diterima, dan Kolom Tanda Tangan Resmi Kepala Sekolah & Ketua Panitia.
   - Ringkasan statistik demografi pendaftar berdasarkan jalur dan jenis kelamin.

---

## 3. Standar Kepatuhan Keamanan & Privasi Data (UU PDP)

1. **Pemisahan Hak Akses (Role-Based Access Control / RBAC)**:
   - Siswa hanya memiliki akses baca/tulis terhadap data pendaftarannya sendiri.
   - Seluruh rute administratif (`/api/admin/*`) diproteksi verifikasi JWT peran admin.
2. **Pengamanan Berkas Kependudukan**:
   - Berkas fisik disimpan di luar public web-root (`backend/storage/documents/`) dengan penamaan acak UUID v4 untuk mencegah serangan *enumeration*.
   - Pengunduhan berkas wajib melalui endpoint terproteksi (`GET /api/documents/:id/download`) dengan pemeriksaan kepemilikan.
3. **Penyembunyian Data Sensitif Publik**:
   - NIK, nomor KK, dan kontak orang tua tidak pernah diekspos ke publik.
   - Nomor NISN pada daftar pengumuman publik disamarkan (contoh: `009621****`).
4. **Proteksi Jaringan & Aplikasi**:
   - Security headers OWASP (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`).
   - Rate limiting 15 upaya per 15 menit per IP pada rute login & registrasi.
   - Error Boundary pada front-end untuk pemulihan antarmuka yang anggun tanpa crash.

---

## 4. Hasil Verifikasi & Pengujian Mutu (QA)

| Kategori Pengujian | Skrip Uji | Jumlah Kasus | Status |
| :--- | :--- | :---: | :---: |
| **UAT & Hardening (Fase 5)** | `backend/test_uat_phase5.js` | 25 Kasus | **100% PASSED** (0 failed) |
| **Integrasi Alur End-to-End (Fase 4)** | `backend/test_integration.js` | 18 Kasus | **100% PASSED** (0 failed) |
| **Kompilasi Bundel Produksi Front-End** | `npm run build` | 1941 modul | **100% PASSED** (926 ms) |
| **Audit Kualitas Kode (Linting)** | `npx oxlint` | 23 file | **0 Error** |

---

## 5. Akun Pengujian Default (Bawaan Seeder)

| Peran | Kredensial Masuk | Kata Sandi | Deskripsi |
| :--- | :--- | :--- | :--- |
| **Panitia PPDB (Admin)** | `panitia.ppdb@smpn1harapan.sch.id` | `password123` | Akses penuh dashboard, verifikasi, seleksi, & ekspor |
| **Calon Siswa (Reguler)** | NISN: `0098765432` | `password123` | Siswa contoh dengan status *Under Review* |
| **Calon Siswa Baru** | Registrasi mandiri di menu Masuk/Daftar | - | Pengisian formulir 5 langkah & unggah berkas baru |

---

## 6. Referensi Dokumentasi Proyek
- **Kebutuhan Produk**: [docs/PRD.md](file:///c:/Users/Lenovo/Downloads/PPDB_SOT_Folder/PPDB_SOT/docs/PRD.md)
- **Pedoman Desain**: [docs/UI-GUIDELINE.md](file:///c:/Users/Lenovo/Downloads/PPDB_SOT_Folder/PPDB_SOT/docs/UI-GUIDELINE.md)
- **Rencana Fase**: [docs/IMPLEMENTATION_PLAN.md](file:///c:/Users/Lenovo/Downloads/PPDB_SOT_Folder/PPDB_SOT/docs/IMPLEMENTATION_PLAN.md)
- **Arsitektur Backend**: [docs/BACKEND_ARCHITECTURE.md](file:///c:/Users/Lenovo/Downloads/PPDB_SOT_Folder/PPDB_SOT/docs/BACKEND_ARCHITECTURE.md)
- **Panduan Deployment Produksi**: [docs/DEPLOYMENT_GUIDE.md](file:///c:/Users/Lenovo/Downloads/PPDB_SOT_Folder/PPDB_SOT/docs/DEPLOYMENT_GUIDE.md)
