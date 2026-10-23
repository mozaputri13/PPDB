# UI Guideline — PPDB MTs/SMP

## 1. Arah Visual
Gaya modern, bersih, ramah, dan profesional dengan nuansa SaaS pendidikan. Prioritaskan keterbacaan, kejelasan status, dan alur pendaftaran yang tidak membingungkan.

## 2. Palet Warna
- Primary green: `#238653`
- Soft green: `#8BDFA8`
- White: `#FFFFFF`
- Background: `#F7FAF8`
- Text utama: `#173126`
- Text sekunder: `#64746B`
- Border: `#E1EAE4`
- Warning: `#D97706`
- Error: `#DC2626`
- Success: `#16834A`

Warna status harus disertai teks/ikon, jangan hanya mengandalkan warna.

## 3. Tipografi
- Gunakan font sans-serif yang mudah dibaca (misalnya Inter atau system sans-serif).
- Judul halaman singkat dan berhierarki jelas.
- Isi teks minimal nyaman dibaca pada layar ponsel.
- Hindari paragraf panjang pada kartu dan formulir.

## 4. Layout dan Komponen
- Container terpusat dengan lebar maksimum yang konsisten.
- Navigasi jelas; area admin menggunakan sidebar pada desktop dan menu ringkas pada layar kecil.
- Kartu memiliki border tipis, radius sedang, dan bayangan ringan bila dibutuhkan.
- Tombol utama menggunakan primary green; aksi destruktif harus dibedakan.
- Formulir dikelompokkan berdasarkan bagian: biodata, orang tua/wali, sekolah asal, dokumen.
- Label selalu terlihat; jangan menggunakan placeholder sebagai pengganti label.
- Tampilkan indikator wajib, validasi inline, dan pesan kesalahan yang spesifik.

## 5. Responsivitas
- Desktop: dashboard dengan sidebar dan area konten.
- Tablet: kurangi jarak dan sesuaikan grid.
- Mobile: satu kolom untuk formulir, tombol mudah disentuh, tabel berubah menjadi daftar/kartu bila diperlukan.

## 6. Aksesibilitas
- Kontras teks dan latar memadai.
- Semua kontrol dapat digunakan dengan keyboard.
- Focus state terlihat.
- Tombol dan ikon memiliki nama/label yang jelas.
- Gunakan heading semantik dan pesan validasi yang terhubung dengan field.

## 7. Status dan Umpan Balik
- Gunakan badge status dengan label teks.
- Tampilkan konfirmasi untuk aksi penting.
- Beri empty state yang menjelaskan tindakan selanjutnya.
- Untuk unggahan, tampilkan nama file, tipe/ukuran, progres bila tersedia, dan aksi hapus/ganti.

## 8. Pola Halaman
### Publik
Header, hero berisi ringkasan PPDB, langkah pendaftaran, persyaratan, jadwal, FAQ, footer.

### Dashboard calon siswa
Ringkasan status, progress formulir, daftar dokumen, catatan perbaikan, tombol bukti pendaftaran, pengumuman.

### Dashboard admin
Kartu statistik, pencarian/filter pendaftar, tabel pendaftar, detail pendaftar, panel verifikasi, pengaturan, hasil seleksi dan laporan.

## 9. Larangan Visual
- Jangan menggunakan terlalu banyak warna aksen.
- Jangan membuat tabel lebar tanpa penanganan mobile.
- Jangan menghilangkan label input.
- Jangan membuat aksi penting hanya berupa ikon tanpa label/tooltip.
- Jangan menambah halaman/fitur yang tidak tercantum di PRD.
