# PRD — Sistem Informasi PPDB MTs/SMP

## 1. Ringkasan Produk
Sistem Informasi PPDB adalah aplikasi berbasis web untuk membantu calon siswa/orang tua melakukan pendaftaran secara daring dan membantu panitia sekolah mengelola, memverifikasi, menyeleksi, serta mengumumkan hasil pendaftaran.

## 2. Tujuan
- Menyederhanakan proses pendaftaran calon siswa.
- Memusatkan data dan dokumen pendaftar.
- Memudahkan panitia melakukan verifikasi dan seleksi.
- Menyediakan informasi status dan pengumuman secara jelas.

## 3. Pengguna dan Hak Akses
### Calon siswa/orang tua
- Melihat informasi PPDB.
- Membuat akun dan masuk.
- Mengisi formulir pendaftaran.
- Mengunggah dokumen yang diminta.
- Melihat status pendaftaran.
- Mengunduh/mencetak bukti pendaftaran.
- Melihat pengumuman hasil.

### Admin/panitia
- Masuk ke panel admin.
- Melihat ringkasan pendaftar.
- Melihat dan mengelola data pendaftar.
- Memverifikasi dokumen dan meminta perbaikan.
- Mengelola jadwal, persyaratan, dan pengaturan PPDB.
- Mengelola hasil seleksi dan pengumuman.
- Mengunduh laporan PDF/Excel.

## 4. Ruang Lingkup Fitur
### Area publik
- Beranda/informasi PPDB.
- Informasi jadwal, persyaratan, alur pendaftaran, dan pengumuman.
- Tombol registrasi dan login.

### Area calon siswa
- Registrasi/login.
- Formulir biodata calon siswa.
- Data orang tua/wali.
- Data sekolah asal SD/MI.
- Unggah Kartu Keluarga, akta kelahiran, pasfoto, dan ijazah/SKL.
- Dashboard status pendaftaran.
- Bukti pendaftaran.
- Pengumuman hasil seleksi.

### Area admin
- Dashboard statistik.
- Daftar dan detail pendaftar.
- Verifikasi dokumen dan status.
- Permintaan perbaikan data/dokumen.
- Pengaturan jadwal dan persyaratan.
- Pengelolaan hasil seleksi.
- Pengumuman.
- Laporan PDF/Excel.

## 5. Alur Utama
1. Calon siswa membuat akun dan login.
2. Calon siswa melengkapi formulir dan mengunggah dokumen.
3. Sistem menandai pendaftaran sebagai menunggu verifikasi.
4. Admin memeriksa data dan dokumen.
5. Jika perlu perbaikan, admin memberi catatan dan calon siswa memperbarui data.
6. Admin memproses seleksi sesuai ketentuan sekolah.
7. Hasil diumumkan dan dapat dilihat oleh calon siswa.

## 6. Status Pendaftaran
- `Draft` — formulir belum dikirim.
- `Submitted` — pendaftaran dikirim.
- `Under Review` — sedang diverifikasi.
- `Needs Revision` — perlu perbaikan.
- `Verified` — data/dokumen terverifikasi.
- `Accepted` — diterima.
- `Not Accepted` — belum diterima.

Status akhir dan label dapat disesuaikan melalui persetujuan pemilik proyek.

## 7. Kebutuhan Nonfungsional
- Antarmuka responsif untuk desktop dan ponsel.
- Bahasa antarmuka utama: Bahasa Indonesia.
- Validasi input dan tipe/ukuran file unggahan.
- Akses berbasis peran untuk area calon siswa dan admin.
- Pesan kesalahan yang jelas.
- Data pribadi dan dokumen hanya dapat diakses oleh pihak berwenang.
- Laporan dapat diekspor ke PDF/Excel.

## 8. Kriteria Penerimaan Tingkat Tinggi
- Pengguna dapat menavigasi halaman publik dan masuk ke alur pendaftaran.
- Calon siswa dapat mengisi data, mengunggah dokumen, dan melihat status.
- Admin dapat memeriksa pendaftar, memberi catatan, dan memperbarui status.
- Hasil seleksi dan pengumuman dapat dikelola.
- Tampilan konsisten dengan `UI-GUIDELINE.md`.
- Tidak ada fase implementasi berikutnya tanpa persetujuan eksplisit.

## 9. Di Luar Ruang Lingkup Saat Ini
- Integrasi pembayaran.
- Integrasi WhatsApp/SMS/email otomatis.
- Integrasi dengan sistem pemerintah/sekolah eksternal.
- Aplikasi mobile native.
- Algoritma seleksi otomatis tanpa aturan resmi sekolah.

Fitur di luar ruang lingkup hanya boleh ditambahkan melalui revisi PRD yang disetujui.
