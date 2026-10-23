# Prompt Execution — PPDB SOT

## Aturan Eksekusi
Prompt harus dijalankan satu fase dalam satu waktu. Jangan meminta agen menyelesaikan seluruh proyek sekaligus. Setelah output tiap fase ditinjau, pengguna memberi persetujuan eksplisit.

## Prompt 0 — Review SOT
```text
Baca README.md, AGENTS.md, PRD.md, UI-GUIDELINE.md, dan IMPLEMENTATION_PLAN.md.
Jangan menulis kode aplikasi dahulu. Periksa konsistensi antar dokumen, daftar konflik/ambiguitas, dan usulkan koreksi minimal.
Tampilkan hasil review dan berhenti untuk meminta persetujuan.
```

## Prompt 1 — Wireframe
```text
Baca seluruh dokumen SOT dan ikuti AGENTS.md.
Kerjakan hanya Fase 1 dalam IMPLEMENTATION_PLAN.md. Buat wireframe untuk halaman yang tercantum di PRD, termasuk state loading, kosong, error, dan sukses.
Jangan membuat backend atau menambah fitur baru. Setelah selesai, laporkan file, cara preview, dan pertanyaan terbuka. Berhenti dan minta persetujuan.
```

## Prompt 2 — Front-end Foundation
```text
Baca seluruh dokumen SOT dan ikuti AGENTS.md.
Hanya setelah Fase 1 disetujui, kerjakan Fase 2 menggunakan React + Vite. Implementasikan design tokens dan komponen/halaman yang telah disetujui. Gunakan data mock dan tandai dengan jelas bagian yang belum terhubung ke backend.
Jalankan pemeriksaan yang tersedia, laporkan hasilnya, lalu berhenti untuk persetujuan.
```

## Prompt 3 — Backend Planning
```text
Baca seluruh dokumen SOT dan ikuti AGENTS.md.
Jangan mulai implementasi backend sebelum pilihan teknologi, database, autentikasi, penyimpanan dokumen, dan model data disetujui. Sajikan usulan arsitektur, skema awal, aturan akses, dan risiko keamanan. Berhenti untuk persetujuan.
```

## Prompt 4 — Integrasi
```text
Kerjakan hanya integrasi yang sudah disetujui dalam IMPLEMENTATION_PLAN.md. Pastikan otorisasi server, validasi file, penanganan error, dan akses dokumen diterapkan. Jangan menampilkan data pribadi ke peran yang tidak berwenang. Uji alur dan laporkan hasilnya. Berhenti untuk persetujuan.
```

## Prompt 5 — Laporan, Hardening, dan UAT
```text
Baca seluruh dokumen SOT dan ikuti AGENTS.md.
Kerjakan Fase 5 dalam IMPLEMENTATION_PLAN.md. Sediakan modul ekspor laporan resmi (PDF A4 siap cetak dengan Kop Surat dan tanda tangan, serta Excel/CSV dengan UTF-8 BOM). Terapkan hardening keamanan (Security Headers, Rate Limiting, Error Boundary, proteksi privasi berkas UU PDP). Jalankan pengujian UAT menyeluruh, perbaiki temuan, dan susun panduan instalasi serta deployment produksi resmi. Laporkan hasil pengujian dan berhenti di gerbang persetujuan rilis.
```

