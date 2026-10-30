import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SCHOOL_INFO } from '../data/mockData';
import { api } from '../services/api';
import {
  Calendar,
  CheckCircle,
  UserPlus,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  Award,
  Compass,
  BookOpen,
  Laptop,
  HeartHandshake,
  Search,
  BellRing,
  Building2,
  Trophy
} from 'lucide-react';
import Skeleton, { CardSkeleton } from '../components/Skeleton';
import ErrorBanner from '../components/ErrorBanner';

export default function PublicHome() {
  const { navigateTo, globalSimState, isBackendConnected } = useApp();
  const [openFaq, setOpenFaq] = useState(null);
  const [announcementData, setAnnouncementData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load public announcement if published
  useEffect(() => {
    async function fetchAnnouncement() {
      try {
        const data = await api.getPublicAnnouncement();
        if (data) setAnnouncementData(data);
      } catch (e) {
        console.warn('Gagal memuat pengumuman publik:', e);
      }
    }
    fetchAnnouncement();
  }, [isBackendConnected]);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const jalurList = [
    {
      id: 'zonasi',
      name: 'Jalur Zonasi',
      quotaPercent: '50%',
      quotaStudents: '108 Siswa',
      color: '#15803d',
      bgLight: '#ecfdf5',
      borderColor: '#86efac',
      icon: Compass,
      desc: 'Diperuntukkan bagi calon peserta didik yang berdomisili di dalam wilayah zonasi terdekat dengan sekolah berdasarkan alamat Kartu Keluarga (KK).',
      syarat: ['KK diterbitkan minimal 1 tahun', 'Radius domisili terverifikasi sistem', 'Ijazah/SKL SD/MI']
    },
    {
      id: 'prestasi',
      name: 'Jalur Prestasi',
      quotaPercent: '30%',
      quotaStudents: '65 Siswa',
      color: '#0284c7',
      bgLight: '#e0f2fe',
      borderColor: '#7dd3fc',
      icon: Trophy,
      desc: 'Dibuka untuk calon siswa dengan nilai rata-rata rapor tertinggi serta sertifikat/piagam kejuaraan akademik, sains, seni, maupun olahraga.',
      syarat: ['Rata-rata nilai rapor min. 80.0', 'Sertifikat kejuaraan resmi (jika ada)', 'Portofolio prestasi']
    },
    {
      id: 'afirmasi',
      name: 'Jalur Afirmasi',
      quotaPercent: '15%',
      quotaStudents: '32 Siswa',
      color: '#d97706',
      bgLight: '#fef3c7',
      borderColor: '#fde68a',
      icon: HeartHandshake,
      desc: 'Didedikasikan untuk calon siswa dari keluarga ekonomi kurang mampu serta penyandang disabilitas yang memenuhi kualifikasi sekolah.',
      syarat: ['Pemegang KIP / PKH / KKS aktif', 'Surat pernyataan orang tua', 'Surat rekomendasi dinas sosial']
    },
    {
      id: 'mutasi',
      name: 'Jalur Perpindahan Tugas',
      quotaPercent: '5%',
      quotaStudents: '11 Siswa',
      color: '#7c3aed',
      bgLight: '#f5f3ff',
      borderColor: '#ddd6fe',
      icon: Building2,
      desc: 'Disediakan khusus bagi calon siswa yang orang tua/walinya dipindahtugaskan secara resmi oleh instansi/lembaga serta untuk anak pendidik/tenaga kependidikan.',
      syarat: ['Surat penugasan resmi orang tua', 'SK mengajar (bagi anak guru)', 'Surat keterangan domisili baru']
    }
  ];

  const faqs = [
    {
      q: 'Apakah pendaftaran calon peserta didik baru dikenakan biaya?',
      a: 'Tidak. Seluruh tahapan pendaftaran PPDB daring di MTs / SMP Negeri 1 Harapan Bangsa 100% bebas biaya (gratis tanpa pungutan liar).'
    },
    {
      q: 'Bagaimana jika ijazah resmi dari SD/MI belum diterbitkan?',
      a: 'Calon siswa dapat menggunakan Surat Keterangan Lulus (SKL) resmi berstempel dan ditandatangani oleh kepala sekolah asal.'
    },
    {
      q: 'Berapa ukuran maksimal dokumen berkas yang dapat diunggah?',
      a: 'Maksimal 2 MB per berkas dokumen, dalam format PDF, JPG, atau PNG dengan kualitas scan/foto yang terbaca jelas dan tidak buram.'
    },
    {
      q: 'Bagaimana cara mengetahui jika dokumen pendaftaran saya perlu direvisi?',
      a: 'Setelah masuk ke Dashboard Siswa, status pendaftaran akan berubah menjadi "Needs Revision" disertai instruksi catatan perbaikan dari verifikator panitia.'
    },
    {
      q: 'Apakah calon peserta didik boleh memilih lebih dari satu jalur masuk?',
      a: 'Tidak. Setiap calon peserta didik hanya dapat memilih 1 (satu) jalur masuk prioritas saat proses pengisian formulir pendaftaran.'
    }
  ];

  const filteredAnnouncement = announcementData?.applicants?.filter((app) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.nama_lengkap?.toLowerCase().includes(q) ||
      app.no_pendaftaran?.toLowerCase().includes(q) ||
      app.sekolah_asal?.toLowerCase().includes(q)
    );
  }) || [];

  if (globalSimState === 'loading') {
    return (
      <div className="container" style={{ padding: '60px 20px' }}>
        <Skeleton height="48px" width="60%" style={{ marginBottom: '20px' }} />
        <Skeleton height="24px" width="80%" style={{ marginBottom: '40px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (globalSimState === 'error') {
    return (
      <div className="container" style={{ padding: '60px 20px' }}>
        <ErrorBanner
          title="Gagal Memuat Informasi Beranda PPDB"
          message="Server simulasi sedang mengalami kendala jaringan saat memuat jadwal dan informasi kuota."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* HERO SECTION ULTRA-MODERN */}
      <section
        style={{
          position: 'relative',
          background: 'radial-gradient(circle at 15% 20%, #ecfdf5 0%, #f8fafc 60%, #f1f5f9 100%)',
          padding: '64px 0 72px',
          borderBottom: '1px solid var(--border)',
          overflow: 'hidden'
        }}
      >
        {/* Subtle Decorative Background Glow */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(21, 128, 61, 0.08) 0%, transparent 70%)',
            top: '-150px',
            right: '-100px',
            pointerEvents: 'none'
          }}
        ></div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 0.9fr',
              gap: '48px',
              alignItems: 'center'
            }}
            className="hero-grid"
          >
            {/* Left Content */}
            <div>
              {/* Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ffffff',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  marginBottom: '20px',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid #bbf7d0'
                }}
              >
                <span className="badge-pulse">
                  <span className="badge-dot"></span>
                </span>
                <span>PPDB TAHUN AJARAN {SCHOOL_INFO.academicYear} RESMI DIBUKA</span>
              </div>

              {/* Title */}
              <h1
                style={{
                  fontSize: 'clamp(32px, 4.2vw, 50px)',
                  fontWeight: 800,
                  lineHeight: 1.18,
                  marginBottom: '20px',
                  letterSpacing: '-0.025em',
                  color: '#0f172a'
                }}
              >
                Mulai Langkah Masa Depan di{' '}
                <span className="gradient-text-emerald">Sekolah Unggulan Berkarakter.</span>
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: '16.5px',
                  color: 'var(--text-muted)',
                  lineHeight: 1.65,
                  marginBottom: '32px',
                  maxWidth: '560px'
                }}
              >
                Sistem pendaftaran peserta didik baru daring terpadu, transparan, dan akuntabel.
                Daftar mudah dari rumah, unggah dokumen digital secara aman, dan pantau status kelulusan secara real-time.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '36px' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => navigateTo('auth', 'register')}
                  style={{
                    padding: '13px 26px',
                    fontSize: '15px',
                    borderRadius: '12px',
                    fontWeight: 700
                  }}
                >
                  <UserPlus size={18} /> Daftar Calon Siswa Baru
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => navigateTo('auth', 'login')}
                  style={{
                    padding: '13px 22px',
                    fontSize: '15px',
                    borderRadius: '12px',
                    fontWeight: 600
                  }}
                >
                  Masuk Akun Pendaftar →
                </button>
              </div>

              {/* Key Trust Highlights */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--border)',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#ecfdf5',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Award size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Akreditasi A Unggul</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>Standar Nasional Pendidikan</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#fef3c7',
                      color: '#d97706',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>100% Bebas Biaya</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>Tanpa Pungutan Liar</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Image & Floating Badges */}
            <div style={{ position: 'relative' }}>
              <div
                className="animate-float"
                style={{
                  position: 'relative',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xl)',
                  border: '4px solid #ffffff'
                }}
              >
                <img
                  src="/images/hero-students.jpg"
                  alt="Siswa-siswi Berprestasi PPDB SMP Negeri 1 Harapan"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'cover'
                  }}
                />
                {/* Subtle Image Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.45) 0%, transparent 60%)'
                  }}
                ></div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '20px',
                    right: '20px',
                    color: '#ffffff'
                  }}
                >
                  <div style={{ fontSize: '15px', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {SCHOOL_INFO.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#e2e8f0', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                    Mencetak Generasi Cerdas, Berakhlak Mulia & Berprestasi
                  </div>
                </div>
              </div>

              {/* Floating Badge 1 (Top Left) */}
              <div
                style={{
                  position: 'absolute',
                  top: '-16px',
                  left: '-16px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  padding: '10px 16px',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span style={{ fontSize: '22px' }}>🏆</span>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a' }}>Sekolah Unggulan</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Juara Prestasi Provinsi</div>
                </div>
              </div>

              {/* Floating Badge 2 (Bottom Right) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-18px',
                  right: '-16px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  padding: '10px 18px',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid #bbf7d0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span style={{ fontSize: '22px' }}>📊</span>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--primary)' }}>Kuota 216 Siswa</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>4 Jalur Penerimaan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP COUNTER SECTION */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border)', padding: '28px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}
          >
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)' }}>216</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Total Daya Tampung</div>
              <div style={{ fontSize: '11.5px', color: '#64748b' }}>Kuota Resmi Tahun 2026</div>
            </div>

            <div style={{ textAlign: 'center', padding: '10px', borderLeft: '1px solid var(--border)' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#0284c7' }}>4 Jalur</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Pilihan Pendaftaran</div>
              <div style={{ fontSize: '11.5px', color: '#64748b' }}>Zonasi, Prestasi, Afirmasi, Mutasi</div>
            </div>

            <div style={{ textAlign: 'center', padding: '10px', borderLeft: '1px solid var(--border)' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#d97706' }}>100%</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Sistem Daring Penuh</div>
              <div style={{ fontSize: '11.5px', color: '#64748b' }}>Daftar & Pantau Dari Rumah</div>
            </div>

            <div style={{ textAlign: 'center', padding: '10px', borderLeft: '1px solid var(--border)' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#7c3aed' }}>24/7</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Akses Portal Sistem</div>
              <div style={{ fontSize: '11.5px', color: '#64748b' }}>Layanan Terbuka Selama PPDB</div>
            </div>
          </div>
        </div>
      </section>

      {/* JALUR PENERIMAAN SECTION */}
      <section style={{ padding: '64px 0', backgroundColor: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
              Pilihan Jalur Masuk
            </div>
            <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
              4 Jalur Penerimaan Peserta Didik Baru
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
              Pilih satu jalur pendaftaran yang paling sesuai dengan kriteria dan kualifikasi calon peserta didik.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px'
            }}
          >
            {jalurList.map((j) => {
              const IconComp = j.icon;
              return (
                <div
                  key={j.id}
                  className="card-modern"
                  style={{
                    padding: '28px',
                    borderTop: `5px solid ${j.color}`,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: j.bgLight,
                        color: j.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <IconComp size={24} />
                    </div>
                    <span
                      style={{
                        backgroundColor: j.bgLight,
                        color: j.color,
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '999px',
                        border: `1px solid ${j.borderColor}`
                      }}
                    >
                      {j.quotaPercent} Kuota
                    </span>
                  </div>

                  <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '6px', color: '#0f172a' }}>
                    {j.name}
                  </h3>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: j.color, marginBottom: '12px' }}>
                    Alokasi: {j.quotaStudents}
                  </div>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                    {j.desc}
                  </p>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      Persyaratan Utama:
                    </div>
                    {j.syarat.map((s, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                        <CheckCircle size={13} style={{ color: j.color }} /> {s}
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn btn-outline"
                    onClick={() => navigateTo('auth', 'register')}
                    style={{
                      width: '100%',
                      borderColor: j.borderColor,
                      color: j.color,
                      fontWeight: 700
                    }}
                  >
                    Daftar {j.name} →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* QUICK ANNOUNCEMENT SEARCH SECTION (PENGUMUMAN RESMI) */}
      <section
        style={{
          padding: '60px 0',
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)'
        }}
      >
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ecfdf5',
                color: 'var(--primary)',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '12.5px',
                fontWeight: 700,
                marginBottom: '10px'
              }}
            >
              <BellRing size={16} /> HASIL SELEKSI PPDB
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Pengumuman Kelulusan Resmi
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
              Cek hasil penetapan kelulusan calon siswa baru. Data NISN disamarkan demi kepatuhan privasi (UU PDP).
            </p>
          </div>

          {/* If Announcement Published */}
          {announcementData?.isPublished ? (
            <div className="card-modern" style={{ padding: '28px' }}>
              {/* Search Box */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                  <Search
                    size={18}
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cari nama siswa, nomor pendaftaran, atau asal sekolah..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '42px', fontSize: '14px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                  Total Diterima: <strong style={{ color: 'var(--primary)' }}>{announcementData.acceptedCount} Siswa</strong>
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                      <th style={{ padding: '12px 14px', color: '#475569', fontWeight: 700 }}>No. Pendaftaran</th>
                      <th style={{ padding: '12px 14px', color: '#475569', fontWeight: 700 }}>Nama Lengkap Siswa</th>
                      <th style={{ padding: '12px 14px', color: '#475569', fontWeight: 700 }}>NISN (Masked)</th>
                      <th style={{ padding: '12px 14px', color: '#475569', fontWeight: 700 }}>Jalur</th>
                      <th style={{ padding: '12px 14px', color: '#475569', fontWeight: 700 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAnnouncement.length > 0 ? (
                      filteredAnnouncement.map((app) => (
                        <tr key={app.no_pendaftaran} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 600 }}>{app.no_pendaftaran}</td>
                          <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{app.nama_lengkap}</td>
                          <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#64748b' }}>{app.nisn_masked}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '6px', background: '#ecfdf5', color: '#15803d', fontWeight: 600 }}>
                              {app.jalur}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '6px', background: '#dcfce7', color: '#166534', fontWeight: 700 }}>
                              ✓ DITERIMA
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                          Tidak ada calon siswa yang cocok dengan pencarian "{searchQuery}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div
              className="card-modern"
              style={{
                padding: '36px',
                textAlign: 'center',
                background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#fef3c7',
                  color: '#d97706',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}
              >
                <Calendar size={28} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Pengumuman Dijadwalkan Pada {SCHOOL_INFO.registrationSchedule.announcementDate}
              </h3>
              <p style={{ fontSize: '14.5px', color: '#64748b', maxWidth: '540px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                Hasil seleksi resmi seluruh jalur akan diumumkan serentak setelah tahapan verifikasi dokumen selesai dilakukan oleh panitia.
              </p>
              <button
                className="btn btn-outline"
                onClick={() => navigateTo('auth', 'login')}
                style={{ fontWeight: 600 }}
              >
                Masuk ke Dashboard Siswa untuk Pantau Status
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ALUR 4 LANGKAH MUDAH */}
      <section style={{ padding: '64px 0', backgroundColor: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
              Alur Pendaftaran
            </div>
            <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
              4 Langkah Mudah Pendaftaran
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
              Prosedur sederhana tanpa antre fisik di sekolah, proses cepat dan transparan.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '22px' }}>
            <div className="card-modern" style={{ padding: '26px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  marginBottom: '18px',
                  boxShadow: '0 4px 12px rgba(21, 128, 61, 0.3)'
                }}
              >
                01
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>Buat Akun Siswa</h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.6 }}>
                Daftar akun baru menggunakan NISN 10 digit resmi, nama lengkap calon siswa, dan email aktif orang tua/wali.
              </p>
            </div>

            <div className="card-modern" style={{ padding: '26px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  marginBottom: '18px',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                }}
              >
                02
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>Isi Biodata & Dokumen</h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.6 }}>
                Lengkapi data diri, orang tua, nilai ujian SD/MI, serta unggah 4 berkas kependudukan (KK, Akta, Pasfoto, SKL maks 2MB).
              </p>
            </div>

            <div className="card-modern" style={{ padding: '26px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  marginBottom: '18px',
                  boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)'
                }}
              >
                03
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>Verifikasi Administrasi</h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.6 }}>
                Tim panitia memeriksa keabsahan data dan berkas. Jika terdapat kekeliruan, siswa dapat memperbarui berkas revisi.
              </p>
            </div>

            <div className="card-modern" style={{ padding: '26px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  marginBottom: '18px',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                }}
              >
                04
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>Pengumuman & Cetak Bukti</h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.6 }}>
                Lihat hasil seleksi kelulusan dan unduh lembar Tanda Bukti Pendaftaran resmi ber-QR Code untuk daftar ulang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KEUNGGULAN SEKOLAH SECTION */}
      <section style={{ padding: '64px 0', backgroundColor: '#ffffff', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 44px' }}>
            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
              Keunggulan Lembaga
            </div>
            <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
              Mengapa Memilih {SCHOOL_INFO.name}?
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
              Fasilitas pembelajaran modern dan program pembinaan kepribadian unggul untuk generasi emas.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            <div className="stat-box-modern">
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ecfdf5', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Laptop size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>Laboratorium Komputer & AI</h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.6 }}>
                Didukung 3 lab komputer berkecepatan tinggi, kurikulum literasi digital, dan pembelajaran coding untuk siswa.
              </p>
            </div>

            <div className="stat-box-modern">
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <BookOpen size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>Program Tahfidz & Karakter</h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.6 }}>
                Pembiasaan ibadah harian, program tahfidz Al-Qur'an terpadu, dan pembentukan akhlak karimah berakhlak mulia.
              </p>
            </div>

            <div className="stat-box-modern">
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Trophy size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>18 Ekstrakurikuler Pilihan</h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.6 }}>
                Mulai dari Robotik, Pramuka, Palang Merah Remaja, Seni Musik Islami, hingga Futsal berprestasi tingkat nasional.
              </p>
            </div>

            <div className="stat-box-modern">
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Building2 size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>Lingkungan Sekolah Nyaman</h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.6 }}>
                Ruang kelas multimedia ber-AC, perpustakaan ramah anak, lapangan olahraga terstandar, dan kantin sehat higienis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* JADWAL DAN PERSYARATAN DOKUMEN SECTION */}
      <section style={{ padding: '64px 0', backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '36px',
              alignItems: 'flex-start'
            }}
            className="syarat-grid"
          >
            {/* Jadwal Resmi */}
            <div className="card-modern" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border)' }}>
                <Calendar size={24} style={{ color: 'var(--primary)' }} />
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Jadwal Resmi PPDB 2026</h3>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Waktu Indonesia Barat (WIB)</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b' }}>Pendaftaran Daring:</span>
                  <strong>{SCHOOL_INFO.registrationSchedule.start} – {SCHOOL_INFO.registrationSchedule.end}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b' }}>Verifikasi Berkas Panitia:</span>
                  <strong>{SCHOOL_INFO.registrationSchedule.start} – {SCHOOL_INFO.registrationSchedule.verificationEnd}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b' }}>Pengumuman Kelulusan:</span>
                  <strong style={{ color: 'var(--primary)' }}>{SCHOOL_INFO.registrationSchedule.announcementDate}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Daftar Ulang Siswa Baru:</span>
                  <strong>{SCHOOL_INFO.registrationSchedule.reRegistration}</strong>
                </div>
              </div>
            </div>

            {/* Dokumen & Garansi UU PDP */}
            <div>
              <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                Persyaratan Berkas
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
                Dokumen Digital yang Disiapkan
              </h2>
              <p style={{ fontSize: '14.5px', color: '#64748b', marginBottom: '22px' }}>
                Format didukung: <strong>PDF, JPG, PNG</strong> dengan ukuran maksimal <strong>2 MB</strong> per berkas.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {SCHOOL_INFO.requiredDocuments.map((doc) => (
                  <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#ffffff', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ color: 'var(--primary)' }}>
                      <CheckCircle size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{doc.name}</strong>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Wajib diunggah saat pengisian formulir</div>
                    </div>
                    <span style={{ fontSize: '11.5px', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                      Maks. 2 MB
                    </span>
                  </div>
                ))}
              </div>

              {/* Garansi Keamanan Privasi Dokumen UU PDP */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  border: '1px solid #bbf7d0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                <ShieldCheck size={22} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '12.5px', color: '#166534', lineHeight: 1.5 }}>
                  <strong>Kepatuhan Privasi Data (UU PDP No. 27/2022)</strong>: Dokumen kependudukan dan NIK calon siswa disimpan di ruang penyimpanan terisolasi dengan enkripsi UUID dan hanya dapat diakses oleh Panitia Verifikator resmi.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{ padding: '64px 0', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
              Tanya Jawab
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)' }}>
              Informasi lengkap seputar ketentuan berkas, alur, dan teknis seleksi PPDB
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="card-modern"
                style={{ padding: '18px 22px', cursor: 'pointer' }}
                onClick={() => toggleFaq(idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '15.5px', fontWeight: 700, color: '#0f172a' }}>
                    {faq.q}
                  </h4>
                  <div style={{ color: 'var(--primary)', marginLeft: '12px' }}>
                    {openFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
                {openFaq === idx && (
                  <p style={{ fontSize: '14px', color: '#475569', marginTop: '14px', lineHeight: 1.6, borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER ELEGAN */}
      <section style={{ padding: '0 0 64px' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, #064e3b 0%, #15803d 60%, #047857 100%)',
              color: '#ffffff',
              borderRadius: '24px',
              padding: '52px 36px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Decorative pattern */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.12) 0%, transparent 40%)',
                pointerEvents: 'none'
              }}
            ></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(6px)',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  marginBottom: '16px'
                }}
              >
                <Sparkles size={14} /> JANGAN LEWATKAN KESEMPATAN INI
              </div>
              <h2 style={{ color: '#ffffff', fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 800, marginBottom: '14px', letterSpacing: '-0.02em' }}>
                Siap Bergabung dengan {SCHOOL_INFO.name}?
              </h2>
              <p style={{ color: '#dcfce7', fontSize: '16px', maxWidth: '620px', margin: '0 auto 28px', lineHeight: 1.6 }}>
                Segera daftarkan putra-putri Anda sebelum batas waktu pendaftaran <strong>30 Juni 2026</strong> ditutup. Kuota terbatas 216 peserta didik!
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-gold"
                  onClick={() => navigateTo('auth', 'register')}
                  style={{
                    padding: '14px 28px',
                    fontSize: '15px',
                    borderRadius: '12px',
                    fontWeight: 700
                  }}
                >
                  Daftar Calon Siswa Baru <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => navigateTo('auth', 'login')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    color: '#ffffff',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backdropFilter: 'blur(6px)'
                  }}
                >
                  Masuk ke Akun
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 868px) {
          .hero-grid, .syarat-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
        }
      `}</style>
    </div>
  );
}
