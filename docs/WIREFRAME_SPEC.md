# Spesifikasi Wireframe & Arsitektur UI — PPDB MTs/SMP

Dokumen ini merupakan artefak resmi untuk **Fase 1 (Validasi Struktur Produk dan Wireframe)** proyek Sistem Informasi PPDB MTs/SMP sesuai dengan [docs/PRD.md](file:///c:/Users/Lenovo/Downloads/PPDB_SOT_Folder/PPDB_SOT/docs/PRD.md) dan [docs/UI-GUIDELINE.md](file:///c:/Users/Lenovo/Downloads/PPDB_SOT_Folder/PPDB_SOT/docs/UI-GUIDELINE.md).

---

## 1. Inventaris Halaman & Komponen Wireframe

Wireframe interaktif dapat dibuka langsung tanpa dependensi server melalui:
`preview/wireframe.html` atau melalui navigasi pada `preview/index.html`.

Berikut adalah pemetaan 8 modul/layar utama:

| No | Nama Layar | Target Pengguna | Komponen & Fitur Kunci |
| :--- | :--- | :--- | :--- |
| **1** | **Publik / Landing Page** | Calon Siswa, Orang Tua, Masyarakat | Hero PPDB, Jadwal resmi, Alur 4 Langkah, Kuota, Persyaratan berkas, FAQ, dan CTA Registrasi. |
| **2** | **Autentikasi (Siswa & Admin)** | Calon Siswa & Panitia | **Calon Siswa**: Registrasi akun baru (NISN, Nama, Email, Sandi) & Login.<br>**Admin/Panitia**: Portal login khusus terproteksi (tanpa registrasi publik). |
| **3** | **Formulir Pendaftaran Siswa** | Calon Siswa | Multi-step form 5 langkah berurutan:<br>1. *Biodata Calon Siswa* (NISN, NIK, Nama, Tempat/Tgl Lahir, Gender, Agama, Alamat)<br>2. *Data Orang Tua/Wali* (Nama Ayah/Ibu, Pekerjaan, No. WhatsApp)<br>3. *Data Sekolah Asal* (Nama SD/MI, NPSN, Nilai Rata-rata)<br>4. *Unggah Berkas Persyaratan* (KK, Akta Kelahiran, Pasfoto 3x4, Ijazah/SKL - maks. 2MB)<br>5. *Resume & Surat Pernyataan Tanggung Jawab Mutlak* sebelum kirim final. |
| **4** | **Dashboard Calon Siswa** | Calon Siswa / Orang Tua | Pelacakan status dinamis (7 status PRD), Lembar Tanda Bukti Pendaftaran (dengan QR code mock & tombol cetak), Kotak Notifikasi Perbaikan Berkas (saat `Needs Revision`), dan Pengumuman Kelulusan Resmi. |
| **5** | **Dashboard Admin / Panitia** | Panitia Verifikator & Administrator | Ringkasan statistik (Total Pendaftar, Menunggu Verifikasi, Perlu Perbaikan, Terverifikasi, Diterima), Tabel data pendaftar lengkap dengan pencarian nama/NISN, filter status, filter jalur, serta pagination. |
| **6** | **Panel Verifikasi Berkas (Admin)** | Panitia Verifikator | Tampilan berdampingan (*Side-by-Side*): Data Formulir Siswa vs Dokumen Berkas yang Diunggah. Aksi verifikator: **Setujui Verifikasi**, **Minta Perbaikan (Revisi)** dengan input catatan khusus, atau **Tolak**. |
| **7** | **Kelola Seleksi & Pengumuman** | Administrator PPDB / Pimpinan | Tabel penetapan kelulusan calon siswa terverifikasi berdasarkan nilai dan jalur, tombol aksi status (`Accepted` / `Not Accepted`), serta kontrol switch status publikasi pengumuman (**Draft** vs **Terbit**). |
| **8** | **Laporan & Rekapitulasi** | Administrator / Panitia | Rekap demografi pendaftar, tombol ekspor laporan resmi: **Ekspor PDF** (siap cetak & tanda tangan) dan **Ekspor Excel** (.xlsx) untuk arsip tata usaha sekolah. |

---

## 2. Pemetaan 7 Status Pendaftaran (PRD) ke Desain UI

Sesuai ketentuan Bagian 6 [docs/PRD.md](file:///c:/Users/Lenovo/Downloads/PPDB_SOT_Folder/PPDB_SOT/docs/PRD.md), berikut representasi badge dan warna yang diimplementasikan:

```
[Draft]           -> Abu-abu Netral (#475569)   : Formulir masih dalam pengerjaan siswa.
[Submitted]       -> Biru Langit (#0284C7)      : Berkas telah dikirim, masuk antrean panitia.
[Under Review]    -> Kuning Amber (#D97706)     : Sedang diperiksa oleh verifikator.
[Needs Revision]  -> Oranye (#EA580C)           : Ada dokumen yang tidak jelas/buram, butuh unggah ulang.
[Verified]        -> Hijau Teal (#0D9488)       : Seluruh berkas sah, siap diseleksi.
[Accepted]        -> Hijau Sukses (#16834A)     : Dinyatakan lulus & diterima.
[Not Accepted]    -> Merah Padam (#DC2626)      : Belum memenuhi kuota/daya tampung.
```

---

## 3. Penanganan 4 State Kritis (Matrix UI States)

Wireframe dilengkapi pengontrol simulasi state untuk memvalidasi:

1. **Normal State**: Alur standar dengan data lengkap dan visual hierarki yang jelas.
2. **Loading State**: Komponen menggunakan *Skeleton Placeholder Animations* pada kartu metrik, baris tabel, dan form input agar transisi terasa mulus saat pengambilan data.
3. **Empty State**: Kotak ilustrasi dan pesan informatif saat tidak ada pendaftar di tabel admin, dokumen belum diunggah, atau filter pencarian tidak menemukan kecocokan.
4. **Error State**: Pesan validasi inline (field wajib/salah format), peringatan berkas melebihi 2MB, dan banner error koneksi dengan tombol aksi `Coba Muat Ulang`.
5. **Success State**: Banner konfirmasi sukses saat pendaftaran berhasil dikirim, akun berhasil dibuat, atau verifikasi berkas disetujui.

---

## 4. Simulator Responsivitas Viewport

Wireframe menyediakan pengalih simulasi tampilan perangkat:
- **Desktop (100% / Max 1200px)**: Sidebar admin penuh, tabel data multi-kolom, tata letak dua kolom untuk verifikasi berkas.
- **Tablet (768px)**: Penyesuaian grid responsif, padding proporsional.
- **Mobile (390px)**: Formulir satu kolom, tombol ramah sentuhan, navigasi menu ringkas, dan susunan kartu vertikal.
