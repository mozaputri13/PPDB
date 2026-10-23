# Dokumen Rencana Arsitektur Backend & Model Data — PPDB MTs/SMP

Dokumen ini merupakan artefak resmi untuk **Fase 3 (Data Model dan Backend Planning)** proyek Sistem Informasi PPDB MTs/SMP berdasarkan kebutuhan pada [docs/PRD.md](file:///c:/Users/Lenovo/Downloads/PPDB_SOT_Folder/PPDB_SOT/docs/PRD.md), [docs/UI-GUIDELINE.md](file:///c:/Users/Lenovo/Downloads/PPDB_SOT_Folder/PPDB_SOT/docs/UI-GUIDELINE.md), dan aturan kerja [AGENTS.md](file:///c:/Users/Lenovo/Downloads/PPDB_SOT_Folder/PPDB_SOT/AGENTS.md).

---

## 1. Usulan Tumpukan Teknologi Backend (Tech Stack)

Berdasarkan keselarasan ekosistem dengan front-end React + Vite dan kemudahan implementasi/pemeliharaan di lingkungan sekolah:

### Opsi Rekomendasi Utama: Node.js (Express.js / Fastify) + Prisma ORM + PostgreSQL / SQLite
- **Runtime & Framework**: **Node.js (LTS v20+)** dengan **Express.js** atau **Fastify**.
  - *Alasan*: Berbagi bahasa (JavaScript/TypeScript) dengan front-end React, ringan, ekosistem middleware autentikasi dan penanganan berkas (Multer) sangat matang.
- **Database & ORM**: **PostgreSQL** (untuk server VPS/Cloud produksi) atau **SQLite** (opsi zero-configuration untuk server lokal sekolah) yang dihubungkan melalui **Prisma ORM**.
  - *Alasan*: Prisma menyediakan migrasi skema yang aman (*type-safe schema migrations*), relasi data yang jelas, dan bebas risiko SQL Injection karena menggunakan *parameterized queries* secara bawaan.
- **Autentikasi**: **JWT (JSON Web Token)** disimpan di *HttpOnly Secure Cookies* dan hashing kata sandi menggunakan **Argon2id** / **bcrypt** (cost factor 12).
- **Penyimpanan Berkas**: Direktori lokal terproteksi (di luar *web-root*) atau **S3-compatible Object Storage (MinIO / Cloudflare R2)**.

---

## 2. Model Data & Skema Database (Database Schema)

Berikut rancangan skema relasional 8 tabel:

```
+--------------------+        1:1        +-----------------------+
|       users        | ----------------- |     registrations     |
| (Auth & Kredensial)|                   |  (Status & Jalur)     |
+--------------------+                   +-----------------------+
                                                     |
                                   +-----------------+-----------------+
                                   | 1:1             | 1:1             | 1:1
                        +--------------------+ +-------------+ +-----------------+
                        |  student_profiles  | |parent_profil| | school_origins  |
                        |  (Biodata Siswa)   | |(Data Ortu)  | |(Sekolah Asal)   |
                        +--------------------+ +-------------+ +-----------------+
                                                     | 1:N
                                         +-----------------------+
                                         |  uploaded_documents   |
                                         |  (KK, Akta, Foto, SKL)|
                                         +-----------------------+
```

### Rincian Tabel Skema

#### 1. Tabel `users` (Akun & Autentikasi)
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Pengenal unik pengguna |
| `nisn` | VARCHAR(10) (Unique) | 10 digit NISN resmi (null untuk admin) |
| `email` | VARCHAR(255) (Unique) | Email aktif untuk notifikasi |
| `password_hash` | VARCHAR(255) | Hash kata sandi Argon2/bcrypt |
| `role` | ENUM | `'student'` atau `'admin'` |
| `is_active` | BOOLEAN | Status aktif akun (default: true) |
| `created_at` | TIMESTAMP | Waktu pembuatan akun |
| `updated_at` | TIMESTAMP | Waktu pembaruan terakhir |

#### 2. Tabel `registrations` (Master Pendaftaran)
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | VARCHAR(20) (PK) | Nomor Pendaftaran (misal: `PPDB-2026-00412`) |
| `user_id` | UUID (FK -> users.id) | Pemilik pendaftaran |
| `jalur` | ENUM | `'Reguler'`, `'Prestasi'`, `'Afirmasi'` |
| `status` | ENUM | `'Draft'`, `'Submitted'`, `'Under Review'`, `'Needs Revision'`, `'Verified'`, `'Accepted'`, `'Not Accepted'` |
| `revisi_notes` | TEXT | Catatan instruksi perbaikan dari verifikator |
| `verified_by` | UUID (FK -> users.id) | ID petugas verifikator yang menyetujui/meminta revisi |
| `verified_at` | TIMESTAMP | Waktu verifikasi berkas |
| `submitted_at` | TIMESTAMP | Waktu final pengiriman formulir |
| `created_at` | TIMESTAMP | Waktu draf dibuat |
| `updated_at` | TIMESTAMP | Waktu data diperbarui |

#### 3. Tabel `student_profiles` (Biodata Siswa)
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | UUID (PK) | ID profil |
| `registration_id` | VARCHAR(20) (FK) | Terhubung 1:1 ke `registrations.id` |
| `nik` | VARCHAR(16) | NIK 16 digit sesuai Kartu Keluarga |
| `nama_lengkap` | VARCHAR(255) | Nama sesuai Akta Kelahiran |
| `tempat_lahir` | VARCHAR(100) | Kota/Kabupaten tempat lahir |
| `tanggal_lahir` | DATE | Tanggal lahir |
| `jenis_kelamin` | ENUM | `'Laki-laki'`, `'Perempuan'` |
| `agama` | VARCHAR(30) | Islam, Kristen, Katolik, Hindu, Buddha, Konghucu |
| `alamat_lengkap` | TEXT | Jalan, RT/RW, Kelurahan, Kecamatan |

#### 4. Tabel `parent_profiles` (Data Orang Tua / Wali)
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | UUID (PK) | ID data orang tua |
| `registration_id` | VARCHAR(20) (FK) | Terhubung 1:1 ke `registrations.id` |
| `nama_ayah` | VARCHAR(255) | Nama lengkap ayah kandung/wali |
| `pekerjaan_ayah` | VARCHAR(100) | Pekerjaan ayah |
| `nama_ibu` | VARCHAR(255) | Nama lengkap ibu kandung |
| `pekerjaan_ibu` | VARCHAR(100) | Pekerjaan ibu |
| `no_whatsapp` | VARCHAR(20) | Nomor HP/WhatsApp aktif orang tua |

#### 5. Tabel `school_origins` (Sekolah Asal SD/MI)
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | UUID (PK) | ID sekolah asal |
| `registration_id` | VARCHAR(20) (FK) | Terhubung 1:1 ke `registrations.id` |
| `nama_sekolah` | VARCHAR(255) | Nama SD/MI asal |
| `npsn` | VARCHAR(8) | Nomor Pokok Sekolah Nasional |
| `tahun_lulus` | VARCHAR(4) | Tahun kelulusan (contoh: 2026) |
| `nilai_rata_rata` | DECIMAL(5,2) | Nilai rata-rata rapor/ujian (contoh: 91.45) |

#### 6. Tabel `uploaded_documents` (Berkas Unggahan)
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | UUID (PK) | ID berkas dokumen |
| `registration_id` | VARCHAR(20) (FK) | Terhubung ke `registrations.id` |
| `document_type` | ENUM | `'KK'`, `'AKTA'`, `'PASFOTO'`, `'SKL'` |
| `file_path` | VARCHAR(500) | Lokasi berkas di server/storage privat (nama hash) |
| `file_name` | VARCHAR(255) | Nama berkas asli saat diunggah |
| `file_size` | INT | Ukuran file dalam bytes (maks. 2.097.152 bytes) |
| `mime_type` | VARCHAR(50) | `application/pdf`, `image/jpeg`, `image/png` |
| `is_verified` | BOOLEAN | Status verifikasi berkas per-dokumen |
| `created_at` | TIMESTAMP | Waktu berkas diunggah |

#### 7. Tabel `ppdb_settings` (Konfigurasi & Kuota PPDB)
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | INT (PK) | ID konfigurasi tunggal (singleton) |
| `academic_year` | VARCHAR(10) | Contoh: `'2026/2027'` |
| `quota_total` | INT | Total daya tampung (contoh: 216) |
| `quota_reguler` | INT | Kuota reguler (130) |
| `quota_prestasi` | INT | Kuota prestasi (50) |
| `quota_afirmasi` | INT | Kuota afirmasi (36) |
| `registration_start` | DATE | Tanggal mulai pendaftaran |
| `registration_end` | DATE | Batas akhir pendaftaran |
| `announcement_date` | DATE | Tanggal pengumuman resmi |
| `is_announcement_published` | BOOLEAN | Switch publikasi (true = dapat dilihat siswa) |

#### 8. Tabel `audit_logs` (Rekam Jejak Operasional)
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | BIGINT (PK) | ID log audit |
| `user_id` | UUID | Aktor yang melakukan aksi |
| `action` | VARCHAR(100) | `STATUS_CHANGE`, `REVISION_REQUESTED`, `FILE_DOWNLOAD` |
| `target_id` | VARCHAR(20) | Nomor pendaftaran yang dimodifikasi |
| `details` | JSONB | Data sebelum dan sesudah perubahan |
| `ip_address` | VARCHAR(45) | IP pengakses untuk keamanan audit |
| `created_at` | TIMESTAMP | Waktu operasional |

---

## 3. Matriks Hak Akses & Otorisasi (RBAC)

| Modul & Endpoint API | Publik (Guest) | Calon Siswa (Student) | Panitia PPDB (Admin) |
| :--- | :---: | :---: | :---: |
| **Info PPDB, Jadwal, Kuota** (`GET /api/public/*`) | ✅ Akses | ✅ Akses | ✅ Akses |
| **Registrasi Akun Siswa** (`POST /api/auth/register`) | ✅ Akses | ❌ (Sudah login) | ❌ |
| **Login Siswa & Admin** (`POST /api/auth/login`) | ✅ Akses | ❌ | ❌ |
| **Isi & Simpan Draf Formulir** (`POST /api/student/form`) | ❌ | ✅ Hanya miliknya | ❌ (Hanya baca) |
| **Kirim Formulir Final** (`POST /api/student/submit`) | ❌ | ✅ Hanya miliknya | ❌ |
| **Unggah/Ganti Dokumen** (`POST /api/student/documents`) | ❌ | ✅ (Status Draft/Revisi) | ❌ |
| **Lihat Status & Cetak Bukti** (`GET /api/student/dashboard`) | ❌ | ✅ Hanya miliknya | ❌ |
| **Lihat Seluruh Pendaftar** (`GET /api/admin/applicants`) | ❌ | ❌ | ✅ Akses penuh |
| **Detail & Unduh Dokumen** (`GET /api/documents/:id`) | ❌ | ✅ Hanya berkas miliknya | ✅ Semua berkas |
| **Aksi Verifikasi & Revisi** (`PUT /api/admin/verify/:id`) | ❌ | ❌ | ✅ Akses penuh |
| **Penetapan Seleksi** (`PUT /api/admin/selection/:id`) | ❌ | ❌ | ✅ Akses penuh |
| **Publikasi Pengumuman** (`PUT /api/admin/announcement`) | ❌ | ❌ | ✅ Akses penuh |
| **Ekspor Laporan PDF/Excel** (`GET /api/admin/reports/*`) | ❌ | ❌ | ✅ Akses penuh |

---

## 4. Strategi Penyimpanan & Privasi Dokumen Berkas

Sesuai ketentuan **UU Perlindungan Data Pribadi (UU PDP)** dan Bagian 7 [docs/PRD.md](file:///c:/Users/Lenovo/Downloads/PPDB_SOT_Folder/PPDB_SOT/docs/PRD.md):
1. **Pemisahan dari Web Root Publik**:
   - Berkas fisik disimpan di folder tertutup `storage/uploads/<registration_id>/` yang **TIDAK** dipublikasikan sebagai static assets via Express/web server.
2. **Pengacakan Nama Berkas (Obfuscation)**:
   - Nama file fisik di-hash menjadi UUID acak (contoh: `d3b07384-d113-4660-84cf-24040a43dc52.pdf`). Nama asli file hanya dicatat pada tabel database untuk keperluan visual pendaftar. Hal ini mencegah *enumeration attack* (tebak nomor file).
3. **Endpoint Unduh Berproteksi Token**:
   - Akses file harus melalui API rute: `GET /api/documents/:document_id/download`.
   - Middleware memvalidasi sesi JWT: Jika pengguna adalah siswa, `document.registration_id` harus sama dengan nomor pendaftaran milik `req.user.id`. Jika admin, akses langsung diberikan dan dicatat di `audit_logs`.
4. **Validasi File Server-Side**:
   - Pengecekan *Magic Bytes* (header biner file) untuk memastikan file PDF/JPG/PNG asli dan bukan berkas berbahaya (.php/.exe) yang diganti ekstensinya.
   - Pembatasan ukuran maksimum berkas sebesar 2 MB secara ketat di level HTTP parser.

---

## 5. Rencana Daftar Endpoint RESTful API

### A. Autentikasi (`/api/auth`)
- `POST /api/auth/register` — Registrasi akun siswa baru (NISN, Nama, Email, Sandi).
- `POST /api/auth/login` — Login akun siswa atau panitia, mengembalikan cookie JWT session.
- `GET /api/auth/me` — Memeriksa sesi aktif dan profil pengguna saat aplikasi dimuat.
- `POST /api/auth/logout` — Menghapus cookie JWT session.

### B. Calon Siswa (`/api/student`)
- `GET /api/student/registration` — Mengambil data formulir, status verifikasi, dan catatan revisi siswa aktif.
- `PUT /api/student/registration` — Menyimpan draf isian formulir (Biodata, Orang Tua, Sekolah Asal).
- `POST /api/student/submit` — Mengirim pendaftaran secara final (status berubah menjadi `Submitted`).
- `POST /api/student/documents` — Mengunggah berkas persyaratan (KK, Akta, Pasfoto, SKL) via `multipart/form-data`.
- `GET /api/student/proof` — Mengambil data terenkripsi untuk cetak lembar tanda bukti registrasi.

### C. Panitia / Admin (`/api/admin`)
- `GET /api/admin/metrics` — Mengambil ringkasan statistik (Total pendaftar, antrean verifikasi, revisi, terverifikasi, diterima).
- `GET /api/admin/applicants` — Mengambil daftar pendaftar dengan paginasi, pencarian keyword, filter status, dan filter jalur.
- `GET /api/admin/applicants/:id` — Mengambil detail lengkap pendaftar beserta berkas unggahan untuk panel verifikasi.
- `POST /api/admin/applicants/:id/verify` — Memperbarui status menjadi `Verified`.
- `POST /api/admin/applicants/:id/revision` — Mengirim catatan kendala dokumen dan mengubah status menjadi `Needs Revision`.
- `POST /api/admin/applicants/:id/reject` — Menolak pendaftaran (`Not Accepted`).
- `PUT /api/admin/selection` — Memperbarui keputusan kelulusan massal/individual.
- `POST /api/admin/announcement/publish` — Toggle publikasi pengumuman hasil seleksi ke calon siswa.
- `GET /api/admin/reports/pdf` — Menghasilkan file PDF rekapitulasi kelulusan siap cetak.
- `GET /api/admin/reports/excel` — Menghasilkan lembar kerja Excel (.xlsx) seluruh data pendaftar.

### D. Dokumen Privat (`/api/documents`)
- `GET /api/documents/:id/download` — Mengunduh/membuka pratinjau berkas terproteksi otorisasi.

---

## 6. Analisis Risiko Keamanan & Langkah Mitigasi

| Kategori Risiko | Potensi Dampak | Langkah Mitigasi Teknis |
| :--- | :--- | :--- |
| **Kebocoran Dokumen Kependudukan (NIK, KK, Akta)** | Pelanggaran UU PDP, penyalahgunaan identitas calon siswa | Berkas tidak boleh ditaruh di folder publik; unduhan wajib melalui controller dengan pemeriksaan otorisasi RBAC; nama file fisik di-hash UUID. |
| **SQL Injection** | Akses database ilegal / kerusakan data | Menggunakan Prisma ORM yang secara baku menerapkan *Parameterized Queries* / *Prepared Statements*. |
| **Serangan Brute Force pada Login/NISN** | Pengambilalihan akun siswa/admin | Menerapkan *Rate Limiting* (misal: maksimal 5 percobaan gagal per 15 menit via `express-rate-limit`) dan verifikasi CAPTCHA sederhana bila diperlukan. |
| **File Upload Berbahaya (Malicious Webshell)** | Pengambilalihan server via upload script berbahaya | Validasi MIME-type via *magic numbers/buffer inspection*, pembatasan ekstensi file ketat, batas ukuran 2 MB, dan direktori penyimpanan tanpa izin eksekusi (`no-exec`). |
| **Broken Access Control (IDOR)** | Siswa A membuka formulir/berkas Siswa B dengan mengganti ID di URL | Otorisasi berbasis kepemilikan (`WHERE user_id = req.user.id`) di setiap controller endpoint calon siswa. |
| **Penyimpanan Kredensial di Source Control** | Kebocoran rahasia sistem ke Git | Menggunakan file `.env` (yang diabaikan di `.gitignore`) untuk seluruh kunci JWT, URL database, dan kredensial server; menyediakan template `.env.example`. |
