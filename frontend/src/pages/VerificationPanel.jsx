import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { REGISTRATION_STATUSES } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  User,
  Users,
  School,
  Eye,
  Send
} from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function VerificationPanel() {
  const {
    applicants,
    selectedApplicantId,
    setSelectedApplicantId,
    updateApplicantStatus,
    navigateTo,
    showToast
  } = useApp();

  const applicant = applicants.find((a) => a.id === selectedApplicantId) || applicants[0];

  const [revisionNote, setRevisionNote] = useState(
    applicant?.revisiNote ||
      'Foto scan Kartu Keluarga pada bagian NIK Orang Tua terpotong dan agak buram. Mohon unggah ulang berkas KK yang lebih jelas dan utuh.'
  );
  const [showRevisionBox, setShowRevisionBox] = useState(applicant?.status === REGISTRATION_STATUSES.NEEDS_REVISION);
  const [activePreviewDoc, setActivePreviewDoc] = useState(null);

  if (!applicant) {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <EmptyState
          title="Pendaftar Tidak Ditemukan"
          description="Pilih salah satu calon siswa dari tabel antrean verifikasi."
          actionLabel="Kembali ke Dashboard Admin"
          onAction={() => navigateTo('admin-dashboard')}
        />
      </div>
    );
  }

  const handleApprove = () => {
    updateApplicantStatus(applicant.id, REGISTRATION_STATUSES.VERIFIED);
  };

  const handleReject = () => {
    if (window.confirm(`Yakin ingin menolak pendaftaran atas nama ${applicant.nama}?`)) {
      updateApplicantStatus(applicant.id, REGISTRATION_STATUSES.NOT_ACCEPTED);
    }
  };

  const handleSendRevision = () => {
    if (!revisionNote.trim()) {
      showToast('Harap masukkan catatan kendala berkas untuk calon siswa.', 'error');
      return;
    }
    updateApplicantStatus(applicant.id, REGISTRATION_STATUSES.NEEDS_REVISION, revisionNote);
    setShowRevisionBox(false);
  };

  return (
    <div className="container" style={{ padding: '36px 20px' }}>
      {/* Top Breadcrumb & Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-outline btn-sm" onClick={() => navigateTo('admin-dashboard')}>
            <ArrowLeft size={16} /> Kembali ke Tabel
          </button>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Verifikasi Dokumen Pendaftar #{applicant.id}
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 800 }}>
              {applicant.nama}
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <StatusBadge status={applicant.status} />

          <button
            className="btn btn-danger btn-sm"
            onClick={handleReject}
            disabled={applicant.status === REGISTRATION_STATUSES.NOT_ACCEPTED}
          >
            <XCircle size={15} /> Tolak Berkas
          </button>

          <button
            className="btn btn-outline btn-sm"
            style={{ color: '#ea580c', borderColor: '#fed7aa', backgroundColor: '#fff7ed' }}
            onClick={() => setShowRevisionBox(!showRevisionBox)}
          >
            <AlertTriangle size={15} /> Minta Perbaikan (Revisi)
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={handleApprove}
            disabled={applicant.status === REGISTRATION_STATUSES.VERIFIED}
          >
            <CheckCircle2 size={15} /> Setujui Verifikasi ✓
          </button>
        </div>
      </div>

      {/* Revision Note Box (Toggleable) */}
      {showRevisionBox && (
        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '2px solid #fde68a',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            marginBottom: '24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400e', fontWeight: 700, fontSize: '15px', marginBottom: '8px' }}>
            <AlertTriangle size={18} /> Tulis Catatan Instruksi Perbaikan untuk Siswa:
          </div>
          <p style={{ fontSize: '13px', color: '#78350f', marginBottom: '12px' }}>
            Catatan ini akan langsung tampil di dashboard calon siswa sehingga mereka dapat mengunggah ulang berkas yang benar.
          </p>
          <textarea
            className="form-textarea"
            rows={3}
            value={revisionNote}
            onChange={(e) => setRevisionNote(e.target.value)}
            placeholder="Tuliskan alasan spesifik berkas yang belum jelas atau perlu diganti..."
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button className="btn btn-outline btn-sm" onClick={() => setShowRevisionBox(false)}>
              Batal
            </button>
            <button
              className="btn btn-primary btn-sm"
              style={{ backgroundColor: '#d97706', borderColor: '#b45309' }}
              onClick={handleSendRevision}
            >
              <Send size={14} /> Kirim Instruksi Revisi ke Siswa
            </button>
          </div>
        </div>
      )}

      {/* 2-Column Side-by-Side Verification Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '24px' }} className="verif-grid">
        {/* Left Column: Form Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 1: Biodata */}
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <User size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>1. Biodata Calon Siswa</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '13.5px' }}>
              <div><span style={{ color: 'var(--text-muted)' }}>Nama Siswa:</span><br /><strong>{applicant.nama}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>NISN:</span><br /><strong>{applicant.nisn}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>NIK:</span><br /><strong>{applicant.nik}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Tempat / Tgl Lahir:</span><br /><strong>{applicant.tempatLahir}, {applicant.tanggalLahir}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Jenis Kelamin:</span><br /><strong>{applicant.jenisKelamin}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Agama:</span><br /><strong>{applicant.agama}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Jalur Pendaftaran:</span><br /><span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{applicant.jalur}</span></div>
              <div style={{ gridColumn: '1 / -1' }}><span style={{ color: 'var(--text-muted)' }}>Alamat Lengkap:</span><br /><strong>{applicant.alamat}</strong></div>
            </div>
          </div>

          {/* Card 2: Data Orang Tua */}
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <Users size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>2. Data Orang Tua / Wali</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '13.5px' }}>
              <div><span style={{ color: 'var(--text-muted)' }}>Nama Ayah:</span><br /><strong>{applicant.namaAyah}</strong> ({applicant.pekerjaanAyah})</div>
              <div><span style={{ color: 'var(--text-muted)' }}>Nama Ibu:</span><br /><strong>{applicant.namaIbu}</strong> ({applicant.pekerjaanIbu})</div>
              <div style={{ gridColumn: '1 / -1' }}><span style={{ color: 'var(--text-muted)' }}>No. WhatsApp Ortu:</span><br /><strong style={{ color: 'var(--primary)' }}>{applicant.whatsappOrtu}</strong></div>
            </div>
          </div>

          {/* Card 3: Sekolah Asal */}
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <School size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>3. Data Sekolah Asal (SD/MI)</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '13.5px' }}>
              <div><span style={{ color: 'var(--text-muted)' }}>Nama Sekolah Asal:</span><br /><strong>{applicant.sekolahAsal}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>NPSN Sekolah:</span><br /><strong>{applicant.npsnAsal}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Tahun Lulus:</span><br /><strong>{applicant.tahunLulus}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Nilai Rata-rata:</span><br /><strong style={{ fontSize: '16px', color: 'var(--primary)' }}>{applicant.nilaiRataRata}</strong></div>
            </div>
          </div>
        </div>

        {/* Right Column: Uploaded Documents Verification */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800 }}>📂 Berkas Persyaratan Terlampir</h3>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Periksa kesesuaian data formulir dengan dokumen asli</div>
            </div>
            <span className="badge badge-verified">4 Berkas</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { id: 'kk', title: '1. Kartu Keluarga (KK)', data: applicant.dokumen.kk },
              { id: 'akta', title: '2. Akta Kelahiran', data: applicant.dokumen.akta },
              { id: 'pasfoto', title: '3. Pasfoto 3x4 Resmi', data: applicant.dokumen.pasfoto },
              { id: 'skl', title: '4. Ijazah / SKL SD/MI', data: applicant.dokumen.skl }
            ].map((doc) => (
              <div
                key={doc.id}
                style={{
                  border: doc.data?.error ? '2px solid #fed7aa' : '1px solid var(--border)',
                  backgroundColor: doc.data?.error ? '#fff7ed' : '#fafcfb',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--text)' }}>{doc.title}</strong>
                  {doc.data?.error ? (
                    <span className="badge badge-needs-revision">Perlu Perbaikan</span>
                  ) : (
                    <span className="badge badge-accepted">✓ Lengkap</span>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <FileText size={18} style={{ color: 'var(--primary)' }} />
                    <span><strong>{doc.data?.name}</strong> ({doc.data?.size})</span>
                  </div>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setActivePreviewDoc(doc)}
                  >
                    <Eye size={14} /> Preview Berkas
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Queue Navigator */}
          <div style={{ marginTop: '28px', paddingTop: '18px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px' }}>
              Antrean Pendaftar Lainnya:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {applicants.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedApplicantId(a.id)}
                  className="btn btn-outline btn-sm"
                  style={{
                    fontSize: '11px',
                    padding: '4px 8px',
                    borderColor: a.id === applicant.id ? 'var(--primary)' : 'var(--border)',
                    background: a.id === applicant.id ? 'var(--primary-light)' : '#ffffff',
                    color: a.id === applicant.id ? 'var(--primary)' : 'var(--text)'
                  }}
                >
                  {a.id} ({a.nama.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {activePreviewDoc && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 29, 22, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setActivePreviewDoc(null)}
        >
          <div
            className="card"
            style={{ width: '100%', maxWidth: '600px', padding: '24px', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-lg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>
                {activePreviewDoc.title}
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setActivePreviewDoc(null)}>
                Tutup
              </button>
            </div>

            {/* Mock document viewer display */}
            <div
              style={{
                height: '340px',
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                textAlign: 'center'
              }}
            >
              <FileText size={48} style={{ color: 'var(--primary)', marginBottom: '14px' }} />
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text)', marginBottom: '4px' }}>
                {activePreviewDoc.data?.name}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Format Resmi PDF/Scan • Ukuran {activePreviewDoc.data?.size}
              </div>
              <div style={{ background: '#ffffff', padding: '12px 20px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '12.5px', color: 'var(--text-muted)', maxWidth: '420px' }}>
                🔍 <strong>Pratinjau Dokumen Mock:</strong> NIK 3201123456780001 dan nama tertera cocok dengan data isian formulir calon siswa.
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .verif-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
