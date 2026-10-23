import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { REGISTRATION_STATUSES } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import {
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Award,
  Search,
  Eye,
  FileSpreadsheet
} from 'lucide-react';
import { TableSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';

export default function AdminDashboard() {
  const {
    applicants,
    navigateTo,
    setSelectedApplicantId,
    globalSimState
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [jalurFilter, setJalurFilter] = useState('ALL');

  // Compute live statistics
  const totalApplicants = applicants.length;
  const underReviewCount = applicants.filter(
    (a) => a.status === REGISTRATION_STATUSES.UNDER_REVIEW || a.status === REGISTRATION_STATUSES.SUBMITTED
  ).length;
  const needsRevisionCount = applicants.filter(
    (a) => a.status === REGISTRATION_STATUSES.NEEDS_REVISION
  ).length;
  const verifiedCount = applicants.filter(
    (a) => a.status === REGISTRATION_STATUSES.VERIFIED
  ).length;
  const acceptedCount = applicants.filter(
    (a) => a.status === REGISTRATION_STATUSES.ACCEPTED
  ).length;

  // Filtered applicants
  const filteredApplicants = applicants.filter((app) => {
    const matchQuery =
      app.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.nisn.includes(searchQuery) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.sekolahAsal.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchJalur = jalurFilter === 'ALL' || app.jalur === jalurFilter;

    return matchQuery && matchStatus && matchJalur;
  });

  const handleOpenVerification = (id) => {
    setSelectedApplicantId(id);
    navigateTo('verification');
  };

  if (globalSimState === 'loading') {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '20px' }}>Dashboard Pendaftar PPDB</h1>
        <TableSkeleton rows={6} cols={6} />
      </div>
    );
  }

  if (globalSimState === 'error') {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <ErrorBanner
          title="Gagal Memuat Data Master Pendaftar"
          message="Server simulasi tidak dapat memproses query pendaftar saat ini."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '36px 20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)' }}>
            Dashboard Data Pendaftar PPDB
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
            Kelola, verifikasi berkas, dan pantau seluruh peserta didik baru tahun ajaran 2026/2027
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline btn-sm" onClick={() => navigateTo('reports')}>
            <FileSpreadsheet size={15} /> Unduh Rekap Data
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigateTo('selection')}>
            <Award size={15} /> Kelola Seleksi & Pengumuman →
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>
            <span>TOTAL PENDAFTAR</span>
            <Users size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text)', margin: '8px 0 2px' }}>
            {totalApplicants}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>
            Seluruh data masuk
          </div>
        </div>

        <div className="card" style={{ padding: '18px', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--warning)', fontSize: '12px', fontWeight: 600 }}>
            <span>MENUNGGU VERIFIKASI</span>
            <Clock size={18} />
          </div>
          <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--warning)', margin: '8px 0 2px' }}>
            {underReviewCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Perlu ditinjau petugas
          </div>
        </div>

        <div className="card" style={{ padding: '18px', borderLeft: '4px solid #ea580c' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ea580c', fontSize: '12px', fontWeight: 600 }}>
            <span>PERLU PERBAIKAN</span>
            <AlertTriangle size={18} />
          </div>
          <div style={{ fontSize: '30px', fontWeight: 800, color: '#ea580c', margin: '8px 0 2px' }}>
            {needsRevisionCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Menunggu unggah ulang siswa
          </div>
        </div>

        <div className="card" style={{ padding: '18px', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--primary)', fontSize: '12px', fontWeight: 600 }}>
            <span>TERVERIFIKASI</span>
            <CheckCircle2 size={18} />
          </div>
          <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--primary)', margin: '8px 0 2px' }}>
            {verifiedCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Berkas sah dan lengkap
          </div>
        </div>

        <div className="card" style={{ padding: '18px', borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--success)', fontSize: '12px', fontWeight: 600 }}>
            <span>DITERIMA</span>
            <Award size={18} />
          </div>
          <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--success)', margin: '8px 0 2px' }}>
            {acceptedCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Lulus seleksi akhir
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              placeholder="Cari nama siswa, NISN, atau no pendaftaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Semua Status</option>
              {Object.values(REGISTRATION_STATUSES).map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            <select
              className="form-select"
              style={{ width: 'auto' }}
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
      </div>

      {/* Main Table or Empty State */}
      {globalSimState === 'empty' || filteredApplicants.length === 0 ? (
        <EmptyState
          title="Tidak Ada Data Pendaftar Ditemukan"
          description="Tidak ditemukan calon siswa yang sesuai dengan filter atau kata kunci pencarian Anda."
          actionLabel="Reset Filter & Pencarian"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('ALL');
            setJalurFilter('ALL');
          }}
        />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>No. Pendaftaran</th>
                <th>Nama Calon Siswa</th>
                <th>NISN</th>
                <th>Sekolah Asal</th>
                <th>Nilai</th>
                <th>Jalur</th>
                <th>Status Pendaftaran</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.map((app) => (
                <tr key={app.id}>
                  <td>
                    <strong>{app.id}</strong>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>{app.nama}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{app.jenisKelamin}</div>
                  </td>
                  <td>{app.nisn}</td>
                  <td>{app.sekolahAsal}</td>
                  <td>
                    <strong>{app.nilaiRataRata}</strong>
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
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleOpenVerification(app.id)}
                    >
                      <Eye size={14} /> Detail & Verifikasi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
