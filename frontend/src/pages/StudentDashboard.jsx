import React from 'react';
import { useApp } from '../context/AppContext';
import { REGISTRATION_STATUSES, SCHOOL_INFO } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import {
  Printer,
  AlertTriangle,
  CheckCircle,
  XCircle,
  QrCode,
  Edit3,
  Sparkles
} from 'lucide-react';
import Skeleton, { CardSkeleton } from '../components/Skeleton';
import ErrorBanner from '../components/ErrorBanner';

export default function StudentDashboard() {
  const {
    currentUser,
    applicants,
    updateApplicantStatus,
    navigateTo,
    isAnnouncementPublished,
    globalSimState,
    showToast
  } = useApp();

  // Find the current student's record (default to Rayhan if logged in)
  const myRecord = applicants.find((a) => a.nisn === currentUser?.nisn) || applicants[0];

  const handleStatusSimulator = (newStatus) => {
    let note = '';
    if (newStatus === REGISTRATION_STATUSES.NEEDS_REVISION) {
      note = 'Foto scan Kartu Keluarga pada bagian NIK Orang Tua terpotong dan agak buram. Mohon unggah ulang berkas KK yang lebih jelas dan utuh.';
    }
    updateApplicantStatus(myRecord.id, newStatus, note);
  };

  const printProof = () => {
    showToast('Simulasi mencetak Lembar Bukti Pendaftaran Resmi (PDF).', 'info');
    window.print();
  };

  if (globalSimState === 'loading') {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <Skeleton height="32px" width="40%" style={{ marginBottom: '20px' }} />
        <CardSkeleton />
        <div style={{ marginTop: '20px' }}>
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (globalSimState === 'error') {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <ErrorBanner
          title="Gagal Memuat Status Pendaftaran"
          message="Tidak dapat mengambil status verifikasi terbaru dari server simulasi."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '980px' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Dashboard Calon Siswa</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Selamat datang, <strong>{myRecord.nama}</strong> (NISN: {myRecord.nisn})
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline btn-sm" onClick={() => navigateTo('form')}>
            <Edit3 size={15} /> Edit Formulir
          </button>
          <button className="btn btn-primary btn-sm" onClick={printProof}>
            <Printer size={15} /> Cetak Bukti Pendaftaran
          </button>
        </div>
      </div>

      {/* Visual Timeline Stepper */}
      <div className="card-modern" style={{ padding: '24px 28px', marginBottom: '28px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Tahapan Perjalanan Pendaftaran Anda:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }} className="timeline-grid">
          {[
            { step: '1', title: 'Kirim Berkas', sub: 'Submitted', done: ['Submitted', 'Under Review', 'Needs Revision', 'Verified', 'Accepted', 'Not Accepted'].includes(myRecord.status) },
            { step: '2', title: 'Verifikasi', sub: 'Under Review', done: ['Under Review', 'Needs Revision', 'Verified', 'Accepted', 'Not Accepted'].includes(myRecord.status), alert: myRecord.status === 'Needs Revision' },
            { step: '3', title: 'Lolos Berkas', sub: 'Verified', done: ['Verified', 'Accepted', 'Not Accepted'].includes(myRecord.status) },
            { step: '4', title: 'Hasil Seleksi', sub: 'Pengumuman', done: ['Accepted', 'Not Accepted'].includes(myRecord.status), isFinal: true }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '12px 8px',
                borderRadius: '12px',
                background: item.alert ? '#fef3c7' : item.done ? '#ecfdf5' : '#f8fafc',
                border: item.alert ? '1px solid #fde68a' : item.done ? '1px solid #bbf7d0' : '1px solid var(--border)'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: item.alert ? '#d97706' : item.done ? 'var(--primary)' : '#e2e8f0',
                  color: item.done || item.alert ? '#ffffff' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '13px',
                  marginBottom: '8px'
                }}
              >
                {item.done ? '✓' : item.step}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: item.alert ? '#92400e' : item.done ? 'var(--primary)' : '#475569' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Switcher Toolbar (Testing Aide - Collapsible) */}
      <details
        style={{
          background: '#f8fafc',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 16px',
          marginBottom: '24px',
          fontSize: '12.5px'
        }}
      >
        <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--text-muted)' }}>
          ⚙️ Uji Coba Simulasi 7 Status Pendaftaran (Panel Pengembang)
        </summary>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
          {Object.values(REGISTRATION_STATUSES).map((st) => (
            <button
              key={st}
              onClick={() => handleStatusSimulator(st)}
              className="btn btn-outline btn-sm"
              style={{
                fontSize: '11px',
                padding: '4px 8px',
                background: myRecord.status === st ? 'var(--primary)' : '#ffffff',
                color: myRecord.status === st ? '#ffffff' : 'var(--text)',
                borderColor: myRecord.status === st ? 'var(--primary)' : 'var(--border)'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </details>

      {/* Main Status Card */}
      <div className="card" style={{ padding: '28px', marginBottom: '24px', borderLeft: '6px solid var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Nomor Pendaftaran: <strong>{myRecord.id}</strong> • Jalur: <strong>{myRecord.jalur}</strong>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Status Pendaftaran Terkini:</h2>
          </div>
          <div>
            <StatusBadge status={myRecord.status} style={{ fontSize: '14px', padding: '6px 14px' }} />
          </div>
        </div>

        {/* Status Explanation Dynamic Text */}
        <div style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {myRecord.status === REGISTRATION_STATUSES.DRAFT && (
            <p>Formulir Anda saat ini berstatus draf dan belum dikirim ke panitia. Silakan periksa kelengkapan biodata dan dokumen lalu klik tombol kirim.</p>
          )}
          {myRecord.status === REGISTRATION_STATUSES.SUBMITTED && (
            <p>Pendaftaran Anda telah berhasil dikirim ke sistem sekolah dan berada dalam antrean penugasan panitia verifikator.</p>
          )}
          {myRecord.status === REGISTRATION_STATUSES.UNDER_REVIEW && (
            <p>Panitia sekolah saat ini sedang memeriksa keabsahan dan kelengkapan berkas kependudukan serta rapor sekolah asal Anda.</p>
          )}
          {myRecord.status === REGISTRATION_STATUSES.NEEDS_REVISION && (
            <p style={{ color: '#9a3412', fontWeight: 500 }}>
              Panitia menemukan adanya ketidaksesuaian atau berkas yang belum jelas terbaca. Harap perhatikan instruksi catatan perbaikan di bawah ini.
            </p>
          )}
          {myRecord.status === REGISTRATION_STATUSES.VERIFIED && (
            <p style={{ color: 'var(--primary)', fontWeight: 500 }}>
              Berkas Anda telah terverifikasi secara lengkap dan sah! Anda dinyatakan berhak mengikuti tahapan pemeringkatan seleksi akhir.
            </p>
          )}
          {myRecord.status === REGISTRATION_STATUSES.ACCEPTED && (
            <p style={{ color: 'var(--success)', fontWeight: 600 }}>
              Selamat! Anda dinyatakan LULUS dan DITERIMA sebagai Peserta Didik Baru di {SCHOOL_INFO.name}.
            </p>
          )}
          {myRecord.status === REGISTRATION_STATUSES.NOT_ACCEPTED && (
            <p style={{ color: 'var(--error)' }}>
              Mohon maaf, berdasarkan kuota daya tampung dan hasil perangkingan seleksi akhir, Anda belum dapat diterima pada periode ini.
            </p>
          )}
        </div>
      </div>

      {/* REVISION ALERT BOX (Only when Needs Revision) */}
      {myRecord.status === REGISTRATION_STATUSES.NEEDS_REVISION && (
        <div
          style={{
            backgroundColor: '#fff7ed',
            border: '2px solid #fed7aa',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px'
          }}
        >
          <div style={{ color: '#ea580c', marginTop: '2px' }}>
            <AlertTriangle size={28} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#9a3412', marginBottom: '6px' }}>
              Catatan Instruksi Perbaikan dari Panitia Verifikator:
            </h3>
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #fed7aa',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                fontSize: '14px',
                color: '#7c2d12',
                marginBottom: '16px',
                lineHeight: 1.5
              }}
            >
              "{myRecord.revisiNote || 'Dokumen yang diunggah belum memenuhi standar kejelasan. Mohon periksa kembali dan unggah ulang berkas yang diminta.'}"
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => navigateTo('form')}>
              <Edit3 size={15} /> Perbaiki & Unggah Ulang Berkas Sekarang →
            </button>
          </div>
        </div>
      )}

      {/* SELECTION DECISION ANNOUNCEMENT (When status Accepted or Not Accepted) */}
      {(myRecord.status === REGISTRATION_STATUSES.ACCEPTED || myRecord.status === REGISTRATION_STATUSES.NOT_ACCEPTED) && (
        isAnnouncementPublished ? (
          <div
            style={{
              backgroundColor: myRecord.status === REGISTRATION_STATUSES.ACCEPTED ? '#f0fdf4' : '#fef2f2',
              border: `2px solid ${myRecord.status === REGISTRATION_STATUSES.ACCEPTED ? '#bbf7d0' : '#fecaca'}`,
              borderRadius: 'var(--radius-md)',
              padding: '28px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '18px'
            }}
          >
            <div style={{ color: myRecord.status === REGISTRATION_STATUSES.ACCEPTED ? 'var(--success)' : 'var(--error)' }}>
              {myRecord.status === REGISTRATION_STATUSES.ACCEPTED ? <CheckCircle size={32} /> : <XCircle size={32} />}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: myRecord.status === REGISTRATION_STATUSES.ACCEPTED ? '#166534' : '#991b1b', marginBottom: '8px' }}>
                {myRecord.status === REGISTRATION_STATUSES.ACCEPTED
                  ? 'PENGUMUMAN: ANDA DINYATAKAN DITERIMA!'
                  : 'PENGUMUMAN HASIL SELEKSI AKHIR'}
              </h3>
              <p style={{ fontSize: '14px', color: myRecord.status === REGISTRATION_STATUSES.ACCEPTED ? '#14532d' : '#7f1d1d', lineHeight: 1.6, marginBottom: '16px' }}>
                {myRecord.status === REGISTRATION_STATUSES.ACCEPTED
                  ? `Berdasarkan Keputusan Panitia Seleksi PPDB ${SCHOOL_INFO.name} Tahun Ajaran ${SCHOOL_INFO.academicYear}, calon siswa dengan nomor pendaftaran ${myRecord.id} dinyatakan DITERIMA pada Jalur ${myRecord.jalur}. Silakan lakukan proses daftar ulang sesuai jadwal.`
                  : `Terima kasih atas partisipasi Anda dalam PPDB ${SCHOOL_INFO.name}. Mohon maaf, berdasarkan kuota daya tampung yang tersedia, Anda belum dinyatakan diterima pada periode pendaftaran kali ini.`}
              </p>
              {myRecord.status === REGISTRATION_STATUSES.ACCEPTED && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => showToast('Mengunduh Surat Keputusan Penerimaan Resmi...', 'success')}>
                    Unduh Surat Keterangan Diterima (PDF)
                  </button>
                  <button className="btn btn-outline btn-sm" onClick={() => showToast('Jadwal Daftar Ulang: 6 - 10 Juli 2026 di Ruang Tata Usaha Sekolah.', 'info')}>
                    Petunjuk Daftar Ulang
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#f8faf9',
              border: '1px dashed var(--primary)',
              borderRadius: 'var(--radius-md)',
              padding: '20px 24px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <Sparkles size={24} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <div style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
              <strong>Pengumuman Kelulusan Belum Diterbitkan:</strong> Keputusan seleksi resmi dijadwalkan pada <strong>{SCHOOL_INFO.registrationSchedule.announcementDate}</strong>. Panitia saat ini sedang memproses pemeringkatan akhir.
            </div>
          </div>
        )
      )}

      {/* PRINTABLE PROOF SHEET */}
      <div className="card" style={{ padding: '36px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Tanda Bukti Registrasi PPDB Online</h3>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Dokumen sah bukti pendaftaran calon peserta didik baru</div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={printProof}>
            <Printer size={15} /> Cetak Lembar Ini
          </button>
        </div>

        {/* Official Layout Box */}
        <div style={{ border: '1px solid var(--border)', padding: '28px', borderRadius: 'var(--radius-sm)', background: '#ffffff' }}>
          <div style={{ textAlign: 'center', borderBottom: '2px solid #173126', paddingBottom: '14px', marginBottom: '22px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#173126' }}>
              PANITIA PENERIMAAN PESERTA DIDIK BARU (PPDB)
            </h2>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>
              {SCHOOL_INFO.name.toUpperCase()}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {SCHOOL_INFO.address} • Telp: {SCHOOL_INFO.phone}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '24px', alignItems: 'center' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '6px 0', color: 'var(--text-muted)', width: '160px' }}>No. Pendaftaran</td>
                  <td style={{ padding: '6px 0' }}>: <strong>{myRecord.id}</strong></td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>NISN</td>
                  <td style={{ padding: '6px 0' }}>: <strong>{myRecord.nisn}</strong></td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>NIK</td>
                  <td style={{ padding: '6px 0' }}>: {myRecord.nik}</td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>Nama Calon Siswa</td>
                  <td style={{ padding: '6px 0' }}>: <strong>{myRecord.nama}</strong></td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>Tempat, Tgl Lahir</td>
                  <td style={{ padding: '6px 0' }}>: {myRecord.tempatLahir}, {myRecord.tanggalLahir}</td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>Jenis Kelamin</td>
                  <td style={{ padding: '6px 0' }}>: {myRecord.jenisKelamin}</td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>Sekolah Asal</td>
                  <td style={{ padding: '6px 0' }}>: {myRecord.sekolahAsal}</td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>Jalur Pendaftaran</td>
                  <td style={{ padding: '6px 0' }}>: <strong>{myRecord.jalur}</strong></td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>Waktu Pendaftaran</td>
                  <td style={{ padding: '6px 0' }}>: {myRecord.waktuDaftar}</td>
                </tr>
              </tbody>
            </table>

            {/* Mock QR Verification */}
            <div style={{ textAlign: 'center', padding: '12px', border: '1px dashed var(--border)', borderRadius: 'var(--radius-sm)', background: '#fafcfb' }}>
              <div style={{ display: 'inline-flex', padding: '10px', background: '#ffffff', border: '1px solid var(--border)', borderRadius: '6px' }}>
                <QrCode size={70} style={{ color: '#173126' }} />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', fontWeight: 600 }}>
                QR Verifikasi Resmi
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {myRecord.id}
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', marginTop: '24px', paddingTop: '16px', fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.5, textAlign: 'center' }}>
            Simpan lembar bukti pendaftaran ini dengan baik sebagai dokumen registrasi yang sah.
            Segala pemalsuan data dokumen akan dikenakan sanksi diskualifikasi sesuai peraturan yang berlaku.
          </div>
        </div>
      </div>
    </div>
  );
}
