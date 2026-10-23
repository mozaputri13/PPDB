# Implementation Plan — PPDB MTs/SMP

## Prinsip
Pengembangan dilakukan bertahap. Setiap fase menghasilkan artefak yang dapat ditinjau. **Dilarang memulai fase berikutnya sebelum pengguna memberikan persetujuan eksplisit.**

## Fase 0 — SOT dan Fondasi
Status: dokumen awal disiapkan untuk review.
- [x] PRD awal
- [x] UI Guideline awal
- [x] Implementation Plan awal
- [x] Aturan agen, prompt execution, README, dan preview statis
- [x] Persetujuan pengguna atas paket dokumen

Gerbang: disetujui oleh pengguna untuk lanjut ke Fase 1.

## Fase 1 — Validasi Struktur Produk dan Wireframe
- [x] Tinjau alur calon siswa dan admin.
- [x] Buat wireframe halaman publik, autentikasi, formulir, dashboard siswa, dashboard admin, verifikasi, seleksi, dan laporan (tersedia di `preview/wireframe.html`).
- [x] Validasi state kosong, error, loading, dan sukses.
- [x] Persetujuan pengguna atas wireframe dan struktur alur.

Gerbang: disetujui oleh pengguna untuk lanjut ke Fase 2.

## Fase 2 — Front-end Foundation
- [x] Siapkan proyek React + Vite (di folder `frontend/`).
- [x] Buat design tokens (`src/index.css`), layout responsif, navigasi (`Navbar.jsx`), dan komponen bersama (`StatusBadge`, `Skeleton`, `EmptyState`, `ErrorBanner`, `Toast`, `MockBanner`).
- [x] Implementasikan halaman berdasarkan wireframe yang disetujui (`PublicHome`, `AuthPage`, `RegistrationForm`, `StudentDashboard`, `AdminDashboard`, `VerificationPanel`, `SelectionManager`, `ReportsExport`).
- [x] Gunakan data mock dan tandai dengan jelas (`src/data/mockData.js` & `MockBanner.jsx`).
- [x] Persetujuan pengguna atas preview front-end.

Gerbang: disetujui oleh pengguna untuk lanjut ke Fase 3 (Backend Planning).

## Fase 3 — Data Model dan Backend
- [x] Usulan pilihan backend, autentikasi, database, dan penyimpanan dokumen (tercantum di `docs/BACKEND_ARCHITECTURE.md`).
- [x] Rancang skema data 8 tabel relasional dan aturan akses RBAC.
- [x] Rancang spesifikasi REST API dan penanganan privasi dokumen berkas kependudukan.
- [x] Analisis risiko keamanan OWASP dan langkah mitigasi.
- [x] Persetujuan pengguna atas rancangan teknis backend sebelum implementasi API/database.

Gerbang: disetujui oleh pengguna untuk lanjut ke Fase 4 (Implementasi Backend & Integrasi Alur PPDB).

## Fase 4 — Integrasi Alur PPDB
- [x] Bangun backend Express + SQLite (`backend/`) dengan 8 tabel relasional dan storage dokumen aman.
- [x] Terapkan otorisasi server (JWT + RBAC), validasi file (ekstensi, maks 2MB, nama acak UUID), dan penanganan error.
- [x] Hubungkan formulir pendaftaran, unggah dokumen, status verifikasi, revisi, seleksi, dan pengumuman dengan database backend.
- [x] Proteksi privasi data pribadi (UU PDP): NIK, dokumen, dan data sensitif tidak ditampilkan ke publik atau peran yang tidak berwenang.
- [x] Uji alur otomatis end-to-end (`backend/test_integration.js` — 18/18 test case lolos).
- [x] Persetujuan pengguna atas uji alur integrasi PPDB.

Gerbang: disetujui oleh pengguna untuk lanjut ke Fase 5 (Laporan, Hardening, Deployment, dan UAT).

## Fase 5 — Laporan, Hardening, dan UAT
- [x] Tambahkan ekspor PDF/Excel (ekspor CSV dengan UTF-8 BOM untuk Excel dan dokumen cetak/PDF resmi A4 dengan Kop Surat SK Penetapan Kelulusan).
- [x] Uji validasi, hak akses, responsivitas, dan penanganan error (Security Headers, Rate Limiting, Error Boundary, proteksi berkas UU PDP).
- [x] Perbaiki temuan UAT (`test_uat_phase5.js` 25/25 PASSED, `test_integration.js` 18/18 PASSED).
- [x] Siapkan panduan instalasi dan deployment (`docs/DEPLOYMENT_GUIDE.md`).

Gerbang: Rilis resmi disetujui (Release Ready v1.0.0 — Seluruh fase selesai).

## Definition of Done per fase
- Ruang lingkup fase dipenuhi.
- Tidak ada perubahan tanpa dasar di PRD.
- UI mengikuti `UI-GUIDELINE.md`.
- Hasil, batasan, dan cara pengujian didokumentasikan.
- Ringkasan perubahan dan pertanyaan yang belum terjawab disampaikan.
- Berhenti dan minta persetujuan pengguna.
