# Panduan Instalasi dan Deployment Produksi — Sistem PPDB MTs/SMP

Panduan resmi ini menjelaskan tata cara instalasi, konfigurasi, pengamanan (*hardening*), deployment produksi, dan pemeliharaan rutin Sistem Informasi Penerimaan Peserta Didik Baru (PPDB) SMP Negeri 1 Harapan.

---

## 1. Arsitektur Sistem & Spesifikasi Kebutuhan

Sistem PPDB dibangun dengan pendekatan arsitektur decoupled modern yang efisien dan andal:
- **Front-End**: Single Page Application (SPA) berbasis **React 19 + Vite 8** dengan Vanilla CSS tokenized design system (ringan, performa tinggi, aksesibel).
- **Back-End**: REST API berbasis **Node.js (Express.js)** dengan database relasional **SQLite native (`node:sqlite`)** tanpa ketergantungan tool kompilasi C++ eksternal.
- **Penyimpanan Berkas**: Storage terisolasi dengan obfuscation nama berkas UUID dan pengamanan hak akses berjenjang (UU PDP No. 27 Tahun 2022).

### Spesifikasi Minimum Server (On-Premise / VPS Cloud)
| Komponen | Spesifikasi Minimum | Rekomendasi Produksi (500-1000 Pendaftar) |
| :--- | :--- | :--- |
| **Sistem Operasi** | Linux (Ubuntu 22.04 LTS / Debian 12) / Windows Server 2019+ | Ubuntu 24.04 LTS x64 |
| **Processor** | 1 vCPU (2.0 GHz) | 2 vCPU atau lebih |
| **RAM** | 1 GB | 2 GB – 4 GB |
| **Penyimpanan (Disk)** | 10 GB SSD | 25 GB – 50 GB NVMe SSD |
| **Runtime Node.js** | Node.js v20.x LTS ke atas | Node.js v22.x LTS atau v26.x |
| **Web Server / Proxy** | Nginx 1.20+ | Nginx 1.24+ dengan HTTP/2 & SSL |

---

## 2. Struktur Proyek

```
PPDB_SOT/
├── backend/
│   ├── data/
│   │   └── ppdb.db               # Database SQLite lokal
│   ├── storage/
│   │   └── documents/            # Berkas pendaftar (terenkripsi/UUID obfuscation)
│   ├── src/
│   │   ├── db/
│   │   │   ├── database.js       # Inisialisasi koneksi SQLite native
│   │   │   └── seed.js           # Seeder kuota, admin, dan pendaftar awal
│   │   ├── middleware/
│   │   │   ├── auth.js           # Verifikasi JWT dan RBAC
│   │   │   ├── rateLimiter.js    # Proteksi brute-force auth
│   │   │   └── upload.js         # Multer validator berkas maks 2MB
│   │   ├── routes/
│   │   │   ├── auth.routes.js    # Endpoint login & registrasi
│   │   │   ├── student.routes.js # Endpoint formulir & dokumen siswa
│   │   │   ├── admin.routes.js   # Endpoint verifikasi, seleksi, dan laporan
│   │   │   ├── document.routes.js# Unduhan dokumen dengan otorisasi ketat
│   │   │   └── public.routes.js  # Info kuota & pengumuman publik (masking)
│   │   └── server.js             # Entrypoint server Express
│   ├── .env                      # Konfigurasi variabel lingkungan backend
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Footer, StatusBadge, ErrorBoundary, dll.
│   │   ├── context/
│   │   │   └── AppContext.jsx    # Manajemen state global aplikasi
│   │   ├── pages/                # 8 Halaman aplikasi PPDB
│   │   ├── services/
│   │   │   └── api.js            # Client HTTP untuk integrasi API backend
│   │   ├── index.css             # Design tokens & utilitas visual
│   │   └── main.jsx
│   ├── dist/                     # Hasil build produksi statis (setelah build)
│   └── package.json
│
└── docs/                         # Seluruh dokumentasi SOT (PRD, UI, Rencana, Deployment)
```

---

## 3. Konfigurasi Variabel Lingkungan (*Environment Variables*)

### A. Konfigurasi Backend (`backend/.env`)
Buat file `backend/.env` berdasarkan template berikut:

```env
# Port aplikasi backend
PORT=3001

# Lingkungan kerja (development / production)
NODE_ENV=production

# Kunci rahasia JWT (Wajib diganti dengan string acak panjang 64+ karakter saat produksi)
JWT_SECRET=b7e28a9c8f4201d4a8e3f96120c4e85741b89ef2391054a8b7c6d5e4f3a2b1c0

# Domain frontend yang diizinkan melakukan request (CORS)
CORS_ORIGIN=https://ppdb.smpn1harapan.sch.id

# Jalur penyimpanan berkas pendaftar
STORAGE_PATH=./storage/documents
```

> [!CAUTION]
> **Penting**: Jangan pernah membagikan atau mengunggah nilai `JWT_SECRET` nyata ke repositori publik (Git). Buat string acak menggunakan perintah:
> `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### B. Konfigurasi Frontend (`frontend/.env`)
Buat file `frontend/.env` jika API di-host pada subdomain berbeda:

```env
# URL base API PPDB
VITE_API_URL=/api
```
*(Catatan: Jika menggunakan reverse proxy Nginx pada domain yang sama, nilai `/api` adalah yang paling optimal).*

---

## 4. Langkah Instalasi & Pengujian Awal (Local / Development)

### 1. Ekstrak / Kloning Repositori
```bash
git clone <url-repositori-ppdb>
cd PPDB_SOT
```

### 2. Instal Dependensi Backend & Frontend
Jalankan perintah instalasi dependensi (Gunakan `npm.cmd` jika di lingkungan Windows PowerShell):
```bash
# Terminal 1: Backend
cd backend
npm install

# Terminal 2: Frontend
cd ../frontend
npm install
```

### 3. Inisialisasi Database & Seeder Data Awal
Database SQLite akan dibuat secara otomatis saat server backend pertama kali dijalankan. Untuk menjalankan seeder awal secara manual:
```bash
cd backend
node src/db/seed.js
```
*Data akun awal bawaan seeder:*
- **Admin Panitia**: `panitia.ppdb@smpn1harapan.sch.id` | Kata Sandi: `password123`
- **Calon Siswa Contoh**: NISN `0098765432` | Kata Sandi: `password123`

### 4. Menjalankan Uji Otomatis (UAT & Integration Tests)
Sebelum deployment, pastikan seluruh pengujian lolos:
```bash
cd backend
node test_uat_phase5.js
node test_integration.js
```
*(Seluruh 43 test case wajib berstatus PASSED)*.

---

## 5. Deployment ke Server Produksi (Linux Ubuntu / Debian)

### Langkah 1: Build Front-End Menjadi Berkas Statis
Jalankan proses kompilasi bundel produksi:
```bash
cd frontend
npm run build
```
Hasil build akan berada di direktori `frontend/dist/`. Direktori ini yang nantinya akan disajikan (*serve*) oleh Nginx.

---

### Langkah 2: Menjalankan Backend Menggunakan Process Manager (PM2)
Gunakan **PM2** agar backend berjalan di latar belakang, otomatis melakukan restart saat server reboot, dan memantau penggunaan memori.

1. **Instal PM2 secara global**:
   ```bash
   sudo npm install -g pm2
   ```

2. **Jalankan backend dengan PM2**:
   ```bash
   cd /var/www/ppdb/backend
   pm2 start src/server.js --name "ppdb-backend" --max-memory-restart 300M
   ```

3. **Simpan daftar proses PM2 agar aktif otomatis saat server booting**:
   ```bash
   pm2 save
   pm2 startup
   # Jalankan perintah yang ditampilkan di terminal output
   ```

4. **Perintah pemantauan PM2**:
   - Melihat status: `pm2 status`
   - Melihat log realtime: `pm2 logs ppdb-backend`
   - Melakukan restart: `pm2 restart ppdb-backend`

---

### Langkah 3: Konfigurasi Web Server Reverse Proxy (Nginx)

Nginx bertindak sebagai front-facing web server yang menyajikan aset front-end, menangani SSL/TLS, dan meneruskan permintaan API ke backend Node.js (port 3001).

1. Buat file konfigurasi Nginx:
   ```bash
   sudo nano /etc/nginx/sites-available/ppdb.conf
   ```

2. Salin konfigurasi standar berikut:
   ```nginx
   server {
       listen 80;
       server_name ppdb.smpn1harapan.sch.id;

       # Batas maksimal ukuran unggah berkas (2 MB sesuai PRD)
       client_max_body_size 3M;

       # 1. Front-End Static Assets
       root /var/www/ppdb/frontend/dist;
       index index.html;

       # Gzip Compression untuk Performa Cepat
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Cache aset statis selama 30 hari
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
           expires 30d;
           add_header Cache-Control "public, no-transform";
       }

       # 2. Reverse Proxy untuk API Backend
       location /api/ {
           proxy_pass http://127.0.0.1:3001/api/;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;

           # Timeout proteksi
           proxy_connect_timeout 60s;
           proxy_read_timeout 60s;
       }

       # 3. Proteksi Akses Langsung Berkas Pendaftar (UU PDP)
       # DILARANG membuka direktori /storage langsung ke publik!
       location /storage/ {
           deny all;
           return 403;
       }
   }
   ```

3. Aktifkan konfigurasi dan periksa sintaks:
   ```bash
   sudo ln -s /etc/nginx/sites-available/ppdb.conf /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

### Langkah 4: Pengamanan SSL/HTTPS Gratis (Let's Encrypt Certbot)
Aktifkan enkripsi HTTPS dengan Certbot:
```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ppdb.smpn1harapan.sch.id
```
Pilih opsi **Redirect all HTTP traffic to HTTPS**. Certbot akan otomatis mengatur pembaruan sertifikat setiap 90 hari.

---

## 6. Prosedur Pemeliharaan, Pencadangan (Backup), & Pemulihan (Disaster Recovery)

### A. Prosedur Backup Rutin Harian
Sistem memiliki 2 komponen data krusial:
1. **Database SQLite**: `backend/data/ppdb.db`
2. **Folder Berkas Pendaftar**: `backend/storage/documents/`

Buat skrip backup otomatis:
```bash
sudo nano /usr/local/bin/backup_ppdb.sh
```
Isi skrip:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/ppdb"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p "$BACKUP_DIR"

# 1. Backup SQLite secara aman menggunakan online vacuum
node -e "
const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('/var/www/ppdb/backend/data/ppdb.db');
db.exec(\"VACUUM INTO '$BACKUP_DIR/ppdb_$TIMESTAMP.db'\");
db.close();
"

# 2. Backup Berkas Dokumen ke tar.gz
tar -czf "$BACKUP_DIR/documents_$TIMESTAMP.tar.gz" -C /var/www/ppdb/backend/storage documents

# 3. Hapus arsip backup yang berusia lebih dari 30 hari
find "$BACKUP_DIR" -type f -mtime +30 -delete

echo "Backup PPDB selesai pada $TIMESTAMP"
```
Beri izin eksekusi dan jadwalkan di cron setiap jam 02.00 pagi:
```bash
sudo chmod +x /usr/local/bin/backup_ppdb.sh
sudo crontab -e
# Tambahkan baris:
0 2 * * * /usr/local/bin/backup_ppdb.sh >> /var/log/ppdb_backup.log 2>&1
```

### B. Prosedur Pemulihan Data (*Restore*)
Jika terjadi kegagalan server atau kehilangan data:
1. Hentikan service backend:
   ```bash
   pm2 stop ppdb-backend
   ```
2. Ganti file database dengan salinan cadangan terbaru:
   ```bash
   cp /var/backups/ppdb/ppdb_<TIMESTAMP>.db /var/www/ppdb/backend/data/ppdb.db
   ```
3. Ekstrak kembali berkas dokumen pendaftar:
   ```bash
   tar -xzf /var/backups/ppdb/documents_<TIMESTAMP>.tar.gz -C /var/www/ppdb/backend/storage/
   ```
4. Jalankan kembali service:
   ```bash
   pm2 start ppdb-backend
   ```

---

## 7. Kebijakan Keamanan & Kepatuhan Privasi Data (UU PDP)

Sistem PPDB telah dirancang dengan standar kepatuhan privasi data:
1. **Pemisahan Peran (RBAC)**: Calon siswa hanya dapat melihat dan menyunting data pendaftarannya sendiri. Panitia admin memiliki hak audit dan penetapan seleksi.
2. **Obfuscation Berkas**: Nama file fisik dokumen pendaftar (KK, Akta, Pasfoto, SKL) diganti secara acak menggunakan UUID v4 sehingga tidak dapat ditebak (*enumeration attack*).
3. **Penyembunyian NIK & Kontak Pribadi di Halaman Publik**: Nomor Induk Kependudukan (NIK) dan nomor WhatsApp orang tua tidak pernah dikirimkan atau ditampilkan pada antarmuka publik. Nomor NISN pada pengumuman kelulusan disamarkan dengan tanda bintang (contoh: `009621****`).
4. **Rate Limiting & Anti-Brute Force**: Upaya login dan registrasi dibatasi maksimal 15 kali percobaan per 15 menit per IP untuk mencegah serangan penebakan kata sandi secara otomatis.
5. **Security Headers**: Respons server dilengkapi header `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, dan `Referrer-Policy` untuk mencegah serangan clickjacking dan MIME-sniffing.
