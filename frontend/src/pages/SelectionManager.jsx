import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { REGISTRATION_STATUSES, SCHOOL_INFO } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import {
  CheckCircle2,
  XCircle,
  Megaphone
} from 'lucide-react';

export default function SelectionManager() {
  const {
    applicants,
    setSelectionDecision,
    isAnnouncementPublished,
    togglePublishAnnouncement
  } = useApp();

  const [jalurFilter, setJalurFilter] = useState('ALL');

  // Sort applicants by score descending
  const sortedApplicants = [...applicants].sort((a, b) => b.nilaiRataRata - a.nilaiRataRata);

  const filteredApplicants = sortedApplicants.filter((app) => {
    return jalurFilter === 'ALL' || app.jalur === jalurFilter;
  });

  const acceptedCount = applicants.filter((a) => a.status === REGISTRATION_STATUSES.ACCEPTED).length;

  return (
    <div className="container" style={{ padding: '36px 20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)' }}>
            Penetapan Hasil Seleksi & Pengumuman
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
            Atur kelulusan berdasarkan pemeringkatan nilai dan kelengkapan berkas pendaftar
          </p>
        </div>

        {/* Publication Control Switch */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            background: '#ffffff',
            border: '2px solid var(--border)',
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ fontSize: '13px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Status Publikasi:</span>{' '}
            <strong style={{ color: isAnnouncementPublished ? 'var(--success)' : 'var(--warning)' }}>
              {isAnnouncementPublished ? 'TERBIT (DAPAT DILIHAT SISWA)' : 'DRAFT (BELUM DIPUBLIKASI)'}
            </strong>
          </div>
          <button
            className={`btn btn-sm ${isAnnouncementPublished ? 'btn-outline' : 'btn-primary'}`}
            onClick={togglePublishAnnouncement}
            style={{ fontWeight: 700 }}
          >
            <Megaphone size={14} />
            {isAnnouncementPublished ? 'Tarik Kembali ke Draft' : 'Terbitkan Pengumuman Resmi'}
          </button>
        </div>
      </div>

      {/* Quota Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '16px', background: 'var(--primary-light)', border: '1px solid var(--soft-green)' }}>
          <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>KUOTA DAYA TAMPUNG</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)', margin: '4px 0' }}>
            {SCHOOL_INFO.quota.total} Siswa
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            Reguler ({SCHOOL_INFO.quota.reguler}) • Prestasi ({SCHOOL_INFO.quota.prestasi}) • Afirmasi ({SCHOOL_INFO.quota.afirmasi})
          </div>
        </div>

        <div className="card" style={{ padding: '16px', borderLeft: '4px solid var(--success)' }}>
          <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 700 }}>TOTAL DITERIMA SAAT INI</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--success)', margin: '4px 0' }}>
            {acceptedCount} Siswa
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            Sisa Kuota: <strong>{SCHOOL_INFO.quota.total - acceptedCount} Kursi</strong>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="card" style={{ padding: '14px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)' }}>
          Daftar Calon Siswa Terurut Berdasarkan Nilai Rata-rata Tertinggi (Ranking)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Filter Jalur:</span>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
            value={jalurFilter}
            onChange={(e) => setJalurFilter(e.target.value)}
          >
            <option value="ALL">Semua Jalur</option>
            <option value="Reguler">Reguler</option>
            <option value="Prestasi">Prestasi</option>
            <option value="Afirmasi">Afirmasi</option>
          </select>
        </div>
      </div>

      {/* Decision Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Peringkat</th>
              <th>Nama Calon Siswa</th>
              <th>NISN</th>
              <th>Sekolah Asal</th>
              <th>Nilai Ujian</th>
              <th>Jalur</th>
              <th>Status Saat Ini</th>
              <th style={{ textAlign: 'right' }}>Keputusan Seleksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.map((app, idx) => (
              <tr key={app.id}>
                <td>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: idx < 3 ? 'var(--primary-light)' : '#f1f5f9',
                      color: idx < 3 ? 'var(--primary)' : 'var(--text-muted)',
                      fontWeight: 700,
                      fontSize: '12.5px'
                    }}
                  >
                    #{idx + 1}
                  </span>
                </td>
                <td>
                  <strong>{app.nama}</strong>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {app.id}</div>
                </td>
                <td>{app.nisn}</td>
                <td>{app.sekolahAsal}</td>
                <td>
                  <strong style={{ fontSize: '14.5px', color: 'var(--primary)' }}>{app.nilaiRataRata}</strong>
                </td>
                <td>
                  <span style={{ fontSize: '12px', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
                    {app.jalur}
                  </span>
                </td>
                <td>
                  <StatusBadge status={app.status} />
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button
                      className={`btn btn-sm ${app.status === REGISTRATION_STATUSES.ACCEPTED ? 'btn-primary' : 'btn-outline'}`}
                      style={{
                        padding: '4px 10px',
                        fontSize: '12px',
                        backgroundColor: app.status === REGISTRATION_STATUSES.ACCEPTED ? 'var(--success)' : '#ffffff'
                      }}
                      onClick={() => setSelectionDecision(app.id, REGISTRATION_STATUSES.ACCEPTED)}
                    >
                      <CheckCircle2 size={13} /> Diterima
                    </button>
                    <button
                      className={`btn btn-sm ${app.status === REGISTRATION_STATUSES.NOT_ACCEPTED ? 'btn-danger' : 'btn-outline'}`}
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                      onClick={() => setSelectionDecision(app.id, REGISTRATION_STATUSES.NOT_ACCEPTED)}
                    >
                      <XCircle size={13} /> Belum Diterima
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
