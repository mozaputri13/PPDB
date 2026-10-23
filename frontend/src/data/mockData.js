// =========================================================================
// DATA MOCK (Belum terhubung ke backend - Fase 2 Front-end Foundation)
// Catatan: Seluruh data di bawah ini adalah data simulasi lokal untuk memvalidasi
// antarmuka, interaksi formulir, dan status alur sebelum backend Fase 3 dibangun.
// =========================================================================

export const SCHOOL_INFO = {
  name: 'MTs / SMP Negeri 1 Harapan Bangsa',
  academicYear: '2026/2027',
  address: 'Jl. Pendidikan No. 45, Harapan Jaya, Kota Mandiri',
  phone: '(021) 555-0199',
  email: 'ppdb@smpn1harapan.sch.id',
  registrationSchedule: {
    start: '1 Mei 2026',
    end: '30 Juni 2026',
    verificationEnd: '2 Juli 2026',
    announcementDate: '5 Juli 2026',
    reRegistration: '6 – 10 Juli 2026'
  },
  quota: {
    total: 216,
    reguler: 130,
    prestasi: 50,
    afirmasi: 36
  },
  requiredDocuments: [
    { id: 'kk', name: 'Kartu Keluarga (KK)', maxMb: 2, formats: ['PDF', 'JPG', 'PNG'], mandatory: true },
    { id: 'akta', name: 'Akta Kelahiran', maxMb: 2, formats: ['PDF', 'JPG', 'PNG'], mandatory: true },
    { id: 'pasfoto', name: 'Pasfoto Resmi 3x4', maxMb: 2, formats: ['JPG', 'PNG'], mandatory: true },
    { id: 'skl', name: 'Ijazah / Surat Keterangan Lulus (SKL) SD/MI', maxMb: 2, formats: ['PDF', 'JPG', 'PNG'], mandatory: true }
  ]
};

// Simulasi Akun Awal
export const MOCK_USERS = {
  student: {
    id: 'user-001',
    role: 'student',
    nama: 'Muhammad Rayhan Pratama',
    nisn: '0098765432',
    email: 'rayhan.pratama@gmail.com'
  },
  admin: {
    id: 'admin-001',
    role: 'admin',
    nama: 'Drs. H. Syamsul Huda, M.Pd.',
    nip: '197508122002121003',
    email: 'panitia.ppdb@smpn1harapan.sch.id'
  }
};

// 7 Status Sesuai PRD.md Bagian 6
export const REGISTRATION_STATUSES = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  NEEDS_REVISION: 'Needs Revision',
  VERIFIED: 'Verified',
  ACCEPTED: 'Accepted',
  NOT_ACCEPTED: 'Not Accepted'
};

// Daftar Master Pendaftar Awal (Mock)
export const INITIAL_APPLICANTS = [
  {
    id: 'PPDB-2026-00412',
    nisn: '0098765432',
    nik: '3201123456780001',
    nama: 'Muhammad Rayhan Pratama',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2013-05-14',
    jenisKelamin: 'Laki-laki',
    agama: 'Islam',
    alamat: 'Jl. Melati No. 15, RT 02/RW 04, Kelurahan Harapan Jaya',
    namaAyah: 'Ahmad Pratama',
    pekerjaanAyah: 'Wiraswasta',
    namaIbu: 'Siti Rahayu',
    pekerjaanIbu: 'Guru SD',
    whatsappOrtu: '081298765432',
    sekolahAsal: 'MIN 1 Kota Mandiri',
    npsnAsal: '60102030',
    tahunLulus: '2026',
    nilaiRataRata: 91.45,
    jalur: 'Reguler',
    waktuDaftar: '12 Mei 2026, 10:45 WIB',
    status: REGISTRATION_STATUSES.UNDER_REVIEW,
    revisiNote: '',
    dokumen: {
      kk: { name: 'KK_Rayhan_Pratama.pdf', size: '1.2 MB', uploaded: true },
      akta: { name: 'Akta_Rayhan.pdf', size: '950 KB', uploaded: true },
      pasfoto: { name: 'Foto_Rayhan_3x4.jpg', size: '420 KB', uploaded: true },
      skl: { name: 'SKL_Sementara_MIN1.pdf', size: '820 KB', uploaded: true }
    }
  },
  {
    id: 'PPDB-2026-00411',
    nisn: '0091122334',
    nik: '3201123456780002',
    nama: 'Aisyah Nur Rahmah',
    tempatLahir: 'Bandung',
    tanggalLahir: '2013-08-20',
    jenisKelamin: 'Perempuan',
    agama: 'Islam',
    alamat: 'Jl. Mawar No. 8, RT 01/RW 02',
    namaAyah: 'Hasan Basri',
    pekerjaanAyah: 'Karyawan Swasta',
    namaIbu: 'Fatimah Az-Zahra',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    whatsappOrtu: '081345678901',
    sekolahAsal: 'SDN 02 Pagi Harapan',
    npsnAsal: '60102031',
    tahunLulus: '2026',
    nilaiRataRata: 88.75,
    jalur: 'Reguler',
    waktuDaftar: '12 Mei 2026, 09:15 WIB',
    status: REGISTRATION_STATUSES.NEEDS_REVISION,
    revisiNote: 'Foto scan Kartu Keluarga pada bagian NIK Orang Tua terpotong dan agak buram. Mohon unggah ulang berkas KK yang lebih jelas dan utuh.',
    dokumen: {
      kk: { name: 'KK_Buram.jpg', size: '650 KB', uploaded: true, error: true },
      akta: { name: 'Akta_Aisyah.pdf', size: '1.1 MB', uploaded: true },
      pasfoto: { name: 'Pasfoto_Aisyah.jpg', size: '380 KB', uploaded: true },
      skl: { name: 'SKL_SDN02.pdf', size: '780 KB', uploaded: true }
    }
  },
  {
    id: 'PPDB-2026-00410',
    nisn: '0089988776',
    nik: '3201123456780003',
    nama: 'Fahri Ahmad Zaki',
    tempatLahir: 'Bekasi',
    tanggalLahir: '2012-11-03',
    jenisKelamin: 'Laki-laki',
    agama: 'Islam',
    alamat: 'Komplek Permata Indah Blok C3 No. 12',
    namaAyah: 'Zainal Abidin',
    pekerjaanAyah: 'PNS',
    namaIbu: 'Mariana',
    pekerjaanIbu: 'Karyawan Swasta',
    whatsappOrtu: '085712345678',
    sekolahAsal: 'SD IT Insan Cendekia',
    npsnAsal: '60102032',
    tahunLulus: '2026',
    nilaiRataRata: 88.10,
    jalur: 'Reguler',
    waktuDaftar: '11 Mei 2026, 14:20 WIB',
    status: REGISTRATION_STATUSES.VERIFIED,
    revisiNote: '',
    dokumen: {
      kk: { name: 'KK_Zaki.pdf', size: '1.4 MB', uploaded: true },
      akta: { name: 'Akta_Zaki.pdf', size: '890 KB', uploaded: true },
      pasfoto: { name: 'Pasfoto_Zaki.jpg', size: '510 KB', uploaded: true },
      skl: { name: 'SKL_InsanCendekia.pdf', size: '920 KB', uploaded: true }
    }
  },
  {
    id: 'PPDB-2026-00409',
    nisn: '0093344556',
    nik: '3201123456780004',
    nama: 'Nabila Shafa Putri',
    tempatLahir: 'Tangerang',
    tanggalLahir: '2013-02-17',
    jenisKelamin: 'Perempuan',
    agama: 'Islam',
    alamat: 'Jl. Kenanga No. 22',
    namaAyah: 'Dedi Kusuma',
    pekerjaanAyah: 'Wiraswasta',
    namaIbu: 'Nurhasanah',
    pekerjaanIbu: 'Wiraswasta',
    whatsappOrtu: '081987654321',
    sekolahAsal: 'SDN 10 Cempaka',
    npsnAsal: '60102033',
    tahunLulus: '2026',
    nilaiRataRata: 89.80,
    jalur: 'Prestasi',
    waktuDaftar: '11 Mei 2026, 11:05 WIB',
    status: REGISTRATION_STATUSES.ACCEPTED,
    revisiNote: '',
    dokumen: {
      kk: { name: 'KK_Nabila.pdf', size: '1.3 MB', uploaded: true },
      akta: { name: 'Akta_Nabila.pdf', size: '1.0 MB', uploaded: true },
      pasfoto: { name: 'Foto_Nabila.jpg', size: '440 KB', uploaded: true },
      skl: { name: 'SKL_SDN10.pdf', size: '810 KB', uploaded: true }
    }
  },
  {
    id: 'PPDB-2026-00408',
    nisn: '0097788990',
    nik: '3201123456780005',
    nama: 'Budi Santoso',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2013-04-10',
    jenisKelamin: 'Laki-laki',
    agama: 'Islam',
    alamat: 'Jl. Anggrek No. 5',
    namaAyah: 'Bambang Santoso',
    pekerjaanAyah: 'Buruh Harian',
    namaIbu: 'Supartini',
    pekerjaanIbu: 'Pedagang',
    whatsappOrtu: '088123456789',
    sekolahAsal: 'SDN 01 Harapan',
    npsnAsal: '60102034',
    tahunLulus: '2026',
    nilaiRataRata: 82.50,
    jalur: 'Afirmasi',
    waktuDaftar: '10 Mei 2026, 16:30 WIB',
    status: REGISTRATION_STATUSES.SUBMITTED,
    revisiNote: '',
    dokumen: {
      kk: { name: 'KK_Budi.pdf', size: '1.5 MB', uploaded: true },
      akta: { name: 'Akta_Budi.pdf', size: '920 KB', uploaded: true },
      pasfoto: { name: 'Foto_Budi.jpg', size: '390 KB', uploaded: true },
      skl: { name: 'SKL_SDN01.pdf', size: '750 KB', uploaded: true }
    }
  },
  {
    id: 'PPDB-2026-00407',
    nisn: '0092233445',
    nik: '3201123456780006',
    nama: 'Citra Dewi Lestari',
    tempatLahir: 'Bogor',
    tanggalLahir: '2013-09-01',
    jenisKelamin: 'Perempuan',
    agama: 'Kristen',
    alamat: 'Jl. Flamboyan No. 19',
    namaAyah: 'Yohanes Lestari',
    pekerjaanAyah: 'PNS',
    namaIbu: 'Maria Susanti',
    pekerjaanIbu: 'Apoteker',
    whatsappOrtu: '081234509876',
    sekolahAsal: 'SDK Budi Mulia',
    npsnAsal: '60102035',
    tahunLulus: '2026',
    nilaiRataRata: 76.20,
    jalur: 'Reguler',
    waktuDaftar: '10 Mei 2026, 13:00 WIB',
    status: REGISTRATION_STATUSES.NOT_ACCEPTED,
    revisiNote: '',
    dokumen: {
      kk: { name: 'KK_Citra.pdf', size: '1.1 MB', uploaded: true },
      akta: { name: 'Akta_Citra.pdf', size: '860 KB', uploaded: true },
      pasfoto: { name: 'Foto_Citra.jpg', size: '470 KB', uploaded: true },
      skl: { name: 'SKL_SDK.pdf', size: '830 KB', uploaded: true }
    }
  }
];
