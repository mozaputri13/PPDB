import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SCHOOL_INFO } from '../data/mockData';
import {
  Calendar,
  CheckCircle,
  UserPlus,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Skeleton, { CardSkeleton } from '../components/Skeleton';
import ErrorBanner from '../components/ErrorBanner';

export default function PublicHome() {
  const { navigateTo, globalSimState } = useApp();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'Apakah pendaftaran calon siswa dikenakan biaya?',
      a: 'Tidak. Seluruh tahapan pendaftaran PPDB daring di MTs/SMP Negeri 1 bebas biaya (gratis).'
    },
    {
      q: 'Bagaimana jika ijazah resmi dari SD/MI belum diterbitkan?',
      a: 'Calon siswa dapat menggunakan Surat Keterangan Lulus (SKL) resmi yang ditandatangani oleh kepala sekolah asal.'
    },
    {
      q: 'Berapa ukuran maksimal dokumen berkas yang dapat diunggah?',
      a: 'Maksimal 2 MB per berkas dokumen, dalam format PDF, JPG, atau PNG dengan tulisan yang terbaca jelas.'
    },
    {
      q: 'Bagaimana cara mengetahui jika berkas saya perlu diperbaiki?',
      a: 'Status pendaftaran di dashboard akan berubah menjadi "Needs Revision" disertai catatan perbaikan dari verifikator.'
    }
  ];

  if (globalSimState === 'loading') {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <Skeleton height="36px" width="50%" style={{ marginBottom: '16px' }} />
        <Skeleton height="20px" width="80%" style={{ marginBottom: '32px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (globalSimState === 'error') {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <ErrorBanner
          title="Gagal Memuat Informasi Beranda PPDB"
          message="Server simulasi sedang mengalami kendala jaringan saat memuat jadwal dan informasi kuota."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, #eaf5ee 0%, var(--bg) 100%)',
          padding: '60px 0 50px',
          borderBottom: '1px solid var(--border)'
        }}
      >
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '48px', alignItems: 'center' }} className="hero-grid">
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '13px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: '16px',
                  border: '1px solid var(--soft-green)'
                }}
              >
                <Sparkles size={16} /> PPDB TAHUN AJARAN {SCHOOL_INFO.academicYear} RESMI DIBUKA
              </div>

              <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', fontWeight: 800, color: 'var(--text)', marginBottom: '18px', letterSpacing: '-0.02em' }}>
                Mulai Langkah Masa Depanmu di Sekolah Unggul.
              </h1>

              <p style={{ fontSize: '16.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
                Sistem pendaftaran peserta didik baru terpadu, transparan, dan mudah. Lengkapi formulir biodata, unggah berkas persyaratan, dan pantau hasil seleksi dari rumah.
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => navigateTo('auth', 'register')}
                >
                  <UserPlus size={18} /> Daftar Calon Siswa Baru
                </button>
                <button
                  className="btn btn-outline btn-lg"
                  onClick={() => navigateTo('auth', 'login')}
                >
                  Masuk Akun Siswa →
                </button>
              </div>
            </div>

            {/* Schedule Highlights Card */}
            <div className="card" style={{ boxShadow: 'var(--shadow-md)', border: '2px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                <Calendar size={22} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '17px', fontWeight: 700 }}>Jadwal Resmi Pelaksanaan</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Pendaftaran Daring:</span>
                  <strong>{SCHOOL_INFO.registrationSchedule.start} – {SCHOOL_INFO.registrationSchedule.end}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Verifikasi Berkas Administrasi:</span>
                  <strong>{SCHOOL_INFO.registrationSchedule.start} – {SCHOOL_INFO.registrationSchedule.verificationEnd}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Pengumuman Hasil Seleksi:</span>
                  <strong style={{ color: 'var(--primary)' }}>{SCHOOL_INFO.registrationSchedule.announcementDate}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Daftar Ulang Siswa Baru:</span>
                  <strong>{SCHOOL_INFO.registrationSchedule.reRegistration}</strong>
                </div>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)', background: 'var(--bg)', margin: '16px -24px -24px -24px', padding: '16px 24px', borderRadius: '0 0 var(--radius-md) var(--radius-md)' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Total Daya Tampung: <strong>{SCHOOL_INFO.quota.total} Siswa</strong> ({SCHOOL_INFO.quota.reguler} Reguler, {SCHOOL_INFO.quota.prestasi} Prestasi, {SCHOOL_INFO.quota.afirmasi} Afirmasi)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Steps Section */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '10px' }}>
              Alur 4 Langkah Mudah Pendaftaran
            </h2>
            <p style={{ fontSize: '15px' }}>
              Prosedur sederhana tanpa perlu antre fisik di sekolah, dapat dipantau kapan saja.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div className="card card-interactive">
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', marginBottom: '16px' }}>
                01
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>Buat Akun Siswa</h3>
              <p style={{ fontSize: '13.5px', lineHeight: 1.5 }}>
                Daftar akun menggunakan NISN 10 digit, nama lengkap siswa, dan email aktif orang tua/wali.
              </p>
            </div>

            <div className="card card-interactive">
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', marginBottom: '16px' }}>
                02
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>Lengkapi Formulir & Berkas</h3>
              <p style={{ fontSize: '13.5px', lineHeight: 1.5 }}>
                Isi biodata, data orang tua, sekolah asal SD/MI, serta unggah KK, Akta, Pasfoto, dan SKL (maks. 2MB).
              </p>
            </div>

            <div className="card card-interactive">
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', marginBottom: '16px' }}>
                03
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>Verifikasi Administrasi</h3>
              <p style={{ fontSize: '13.5px', lineHeight: 1.5 }}>
                Panitia sekolah memeriksa keabsahan berkas. Bila ada ketidaksesuaian, siswa dapat merevisi berkas.
              </p>
            </div>

            <div className="card card-interactive">
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', marginBottom: '16px' }}>
                04
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>Pengumuman & Cetak Bukti</h3>
              <p style={{ fontSize: '13.5px', lineHeight: 1.5 }}>
                Unduh lembar tanda bukti pendaftaran resmi dan lihat hasil seleksi akhir langsung di dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Persyaratan Dokumen Section */}
      <section style={{ padding: '50px 0', backgroundColor: '#ffffff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px', alignItems: 'center' }} className="syarat-grid">
            <div>
              <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                Persyaratan Dokumen Resmi
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '14px' }}>
                Berkas yang Perlu Disiapkan
              </h2>
              <p style={{ fontSize: '15px', marginBottom: '24px' }}>
                Pastikan dokumen dalam kondisi baik, tulisan terbaca jelas, dan dipindai (scan/foto) dengan batas ukuran file maksimal 2 MB per berkas.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {SCHOOL_INFO.requiredDocuments.map((doc) => (
                  <div key={doc.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ color: 'var(--primary)', marginTop: '2px' }}>
                      <CheckCircle size={18} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '14.5px', color: 'var(--text)' }}>{doc.name}</strong>
                      <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                        Format {doc.formats.join(', ')} • Ukuran maksimal {doc.maxMb} MB
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <ShieldCheck size={22} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '17px', fontWeight: 700 }}>Jaminan Keamanan Dokumen</h3>
              </div>
              <p style={{ fontSize: '13.5px', lineHeight: 1.6, marginBottom: '16px' }}>
                Seluruh dokumen pendaftar disimpan secara terenkripsi dan hanya dapat diakses oleh Panitia Verifikator resmi {SCHOOL_INFO.name}.
              </p>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                💡 <em>Tips: Jika menggunakan kamera ponsel, pastikan pencahayaan cukup dan nomor NIK/NISN terlihat tajam tanpa pantulan cahaya.</em>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p style={{ fontSize: '14.5px' }}>
              Informasi seputar pendaftaran, berkas, dan ketentuan kelulusan
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="card"
                style={{ padding: '18px 20px', cursor: 'pointer', transition: 'var(--transition)' }}
                onClick={() => toggleFaq(idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
                    {faq.q}
                  </h4>
                  <div style={{ color: 'var(--primary)' }}>
                    {openFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
                {openFaq === idx && (
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '12px', lineHeight: 1.6, borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section style={{ padding: '0 0 60px' }}>
        <div className="container">
          <div
            style={{
              backgroundColor: '#173126',
              color: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '48px 36px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <h2 style={{ color: '#ffffff', fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>
              Siap Mendaftarkan Diri?
            </h2>
            <p style={{ color: '#d1fae5', fontSize: '16px', maxWidth: '600px', margin: '0 auto 24px' }}>
              Segera buat akun siswa baru sebelum batas waktu pendaftaran 30 Juni 2026 berakhir.
            </p>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigateTo('auth', 'register')}
              style={{ backgroundColor: 'var(--primary)', color: '#ffffff' }}
            >
              Mulai Pendaftaran Sekarang <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid, .syarat-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
      `}</style>
    </div>
  );
}
