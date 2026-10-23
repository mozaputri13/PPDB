# AGENTS.md — Aturan Agen Proyek PPDB

## Prioritas Sumber Kebenaran
1. `PRD.md` untuk ruang lingkup dan perilaku produk.
2. `UI-GUIDELINE.md` untuk desain dan UX.
3. `IMPLEMENTATION_PLAN.md` untuk urutan fase dan gerbang persetujuan.
4. Instruksi eksplisit terbaru dari pemilik proyek, selama tidak bertentangan dengan batasan keamanan.

## Wajib
- Baca ketiga dokumen SOT sebelum mengubah atau membuat implementasi.
- Kerjakan hanya fase yang sedang disetujui.
- Ajukan pertanyaan bila kebutuhan penting belum jelas.
- Setelah fase selesai, tampilkan ringkasan, file yang berubah, cara menjalankan/menguji, dan risiko/batasan.
- Minta persetujuan eksplisit sebelum fase berikutnya.
- Gunakan React + Vite untuk fondasi front-end sesuai rencana saat ini.
- Gunakan Bahasa Indonesia untuk UI dan dokumentasi pengguna.
- Jaga aksesibilitas, responsivitas, validasi, dan privasi dokumen pendaftar.

## Dilarang
- Melompati fase atau menganggap diam sebagai persetujuan.
- Menambah fitur di luar PRD tanpa persetujuan.
- Mengganti palet/arah visual tanpa alasan dan persetujuan.
- Mengklaim fitur sudah terintegrasi jika masih menggunakan data mock.
- Menyimpan kredensial, token, atau data pribadi nyata di source control.
- Menonaktifkan proteksi keamanan untuk mengatasi masalah build/install tanpa diagnosis.

## Protokol Kerja
1. Identifikasi fase aktif dan deliverable.
2. Ringkas rencana singkat.
3. Implementasikan hanya deliverable yang disetujui.
4. Jalankan pemeriksaan yang relevan.
5. Laporkan hasil dan keterbatasan.
6. Berhenti pada gerbang persetujuan.
