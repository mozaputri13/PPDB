import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  FileText,
  FileSpreadsheet,
  Download,
  PieChart,
  BarChart3,
  Printer,
  X,
  Award
} from 'lucide-react';

export default function ReportsExport() {
  const { applicants, showToast, isBackendConnected } = useApp();
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [decreeData, setDecreeData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);

  // Fetch summary from backend if connected
  useEffect(() => {
    async function loadStats() {
      if (isBackendConnected) {
        try {
          const res = await api.getReportsSummary();
          if (res) setSummaryData(res);
        } catch (e) {
          console.error('Failed to load report summary:', e);
        }
      }
    }
    loadStats();
  }, [isBackendConnected]);

  const handleExportExcel = async () => {
    try {
      setIsExportingExcel(true);
      showToast('Menyiapkan berkas ekspor Excel/CSV...', 'info');
      await api.downloadExportCsv();
      showToast('Rekap_Pendaftar_PPDB_2026.csv berhasil diunduh.', 'success');
    } catch (err) {
      console.warn('Backend download failed, falling back to client-side CSV:', err);
      // Client-side fallback if backend unreachable
      const headers = ['No. Pendaftaran', 'NISN', 'Nama Siswa', 'Gender', 'Sekolah Asal', 'Nilai', 'Jalur', 'Status'];
      const rows = applicants.map(a => [
        a.id,
        a.nisn,
        `"${a.nama}"`,
        a.jenisKelamin,
        `"${a.sekolahAsal}"`,
        a.nilaiRataRata,
        a.jalur,
        a.status
      ]);
      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'Rekap_Pendaftar_PPDB_2026.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Data Pendaftar berhasil diekspor ke CSV (Excel).', 'success');
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleOpenPdfModal = async () => {
    try {
      if (isBackendConnected) {
        const data = await api.getOfficialDecree();
        setDecreeData(data);
      }
    } catch (e) {
      console.warn('Could not load decree from server, using local:', e);
    }
    setShowPdfModal(true);
  };

  const handlePrintOfficialPdf = () => {
    if (isBackendConnected) {
      api.openPdfReport();
    } else {
      window.print();
    }
    showToast('Membuka pratinjau cetak Laporan Resmi PDF...', 'info');
  };

  // Aggregated data calculation
  const jalurStats = summaryData?.jalur
    ? summaryData.jalur.reduce((acc, curr) => ({ ...acc, [curr.jalur]: curr.count }), {})
    : applicants.reduce((acc, curr) => {
        acc[curr.jalur] = (acc[curr.jalur] || 0) + 1;
        return acc;
      }, {});

  const genderStats = summaryData?.gender
    ? summaryData.gender.reduce((acc, curr) => ({ ...acc, [curr.gender]: curr.count }), {})
    : applicants.reduce((acc, curr) => {
        acc[curr.jenisKelamin] = (acc[curr.jenisKelamin] || 0) + 1;
        return acc;
      }, {});

  const acceptedStudents = decreeData?.acceptedStudents || applicants.filter(a => a.status === 'Accepted');

  return (
    <div className="container" style={{ padding: '36px 20px' }}>
      {/* Title */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)' }}>
          Laporan & Ekspor Data PPDB
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
          Unduh rekapitulasi data pendaftar untuk arsip resmi sekolah dan pelaporan dinas pendidikan
        </p>
      </div>

      {/* Export Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px', marginBottom: '36px' }}>
        {/* PDF Card */}
        <div className="card" style={{ padding: '26px', borderTop: '4px solid var(--primary)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <FileText size={26} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
            Laporan Rekapitulasi Kelulusan (PDF)
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>
            Dokumen resmi siap cetak berisi Surat Keputusan (SK), daftar siswa diterima, peringkat nilai, serta kolom tanda tangan Ketua Panitia dan Kepala Sekolah.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleOpenPdfModal} style={{ flex: 1 }}>
              <FileText size={16} /> Pratinjau SK & Cetak PDF
            </button>
            <button className="btn btn-outline" onClick={handlePrintOfficialPdf} title="Cetak langsung dokumen resmi A4">
              <Printer size={16} /> Cetak Langsung
            </button>
          </div>
        </div>

        {/* Excel Card */}
        <div className="card" style={{ padding: '26px', borderTop: '4px solid #10b981', display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <FileSpreadsheet size={26} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
            Ekspor Seluruh Data Pendaftar (Excel)
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>
            Format lembar kerja terstruktur (.csv UTF-8 kompatibel Excel) mencakup biodata lengkap, NIK, NISN, kontak orang tua, dan nilai ujian untuk arsip Tata Usaha.
          </p>
          <button 
            className="btn btn-outline" 
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            style={{ width: '100%', borderColor: '#10b981', color: '#047857' }}
          >
            <Download size={16} /> {isExportingExcel ? 'Mengunduh berkas...' : 'Ekspor Lembar Kerja Excel (.csv)'}
          </button>
        </div>
      </div>

      {/* Demographic Breakdown */}
      <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
        Ringkasan Demografi Pendaftar
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {/* Jalur Breakdown */}
        <div className="card" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} style={{ color: 'var(--primary)' }} /> Berdasarkan Jalur Masuk
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
            {Object.entries(jalurStats).map(([jalur, count]) => (
              <div key={jalur} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Jalur {jalur}</span>
                <strong>{count} Calon Siswa</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Gender Breakdown */}
        <div className="card" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={18} style={{ color: 'var(--primary)' }} /> Berdasarkan Jenis Kelamin
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
            {Object.entries(genderStats).map(([gender, count]) => (
              <div key={gender} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{gender}</span>
                <strong>{count} Calon Siswa</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Pratinjau SK & Laporan PDF Resmi */}
      {showPdfModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '850px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            {/* Modal Top Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={24} style={{ color: 'var(--primary)' }} />
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0 }}>Pratinjau Dokumen Resmi Kelulusan</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Format Surat Keputusan (SK) Panitia & Tabel Kelulusan A4</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-primary" onClick={handlePrintOfficialPdf}>
                  <Printer size={16} /> Cetak / Unduh PDF
                </button>
                <button
                  onClick={() => setShowPdfModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Simulated Official Letter / Document */}
            <div
              style={{
                fontFamily: 'serif',
                border: '1px solid #cbd5e1',
                padding: '36px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.02)'
              }}
            >
              {/* Kop Surat */}
              <div style={{ textAlign: 'center', borderBottom: '3px double #000', paddingBottom: '12px', marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>PEMERINTAH KABUPATEN / KEMENTERIAN AGAMA</div>
                <div style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>DINAS PENDIDIKAN DAN KEBUDAYAAN</div>
                <div style={{ fontSize: '18px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>
                  {decreeData?.schoolName || 'SMP NEGERI 1 HARAPAN'}
                </div>
                <div style={{ fontSize: '11px', color: '#475569', fontStyle: 'italic', marginTop: '4px' }}>
                  Jl. Pendidikan Mandiri No. 45 | Telp: (021) 8876543 | Laman: ppdb.smpn1harapan.sch.id
                </div>
              </div>

              {/* Judul SK */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, textDecoration: 'underline' }}>
                  SURAT KEPUTUSAN PENETAPAN HASIL SELEKSI PPDB
                </div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                  NOMOR: {decreeData?.skNumber || '421.3 / 088 / PAN-PPDB / SMPN1 / 2026'}
                </div>
              </div>

              {/* Isi Ringkas */}
              <p style={{ fontSize: '12.5px', lineHeight: 1.6, textAlign: 'justify' }}>
                Berdasarkan hasil sidang pleno panitia Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran {decreeData?.academicYear || '2026 / 2027'} terhadap verifikasi dokumen kependudukan dan pemeringkatan nilai ujian/prestasi, dengan ini Panitia memutuskan bahwa calon peserta didik berikut dinyatakan:
              </p>

              <div style={{ textAlign: 'center', margin: '14px 0', padding: '10px', background: '#ecfdf5', borderRadius: '6px', border: '1px dashed #10b981' }}>
                <strong style={{ color: '#047857', fontSize: '15px', letterSpacing: '2px' }}>DITERIMA SEBAGAI SISWA BARU</strong>
              </div>

              {/* Tabel Siswa Diterima */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px', marginTop: '16px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', borderTop: '1px solid #334155', borderBottom: '1px solid #334155' }}>
                    <th style={{ padding: '8px', border: '1px solid #cbd5e1', width: '30px', textAlign: 'center' }}>No</th>
                    <th style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'left' }}>No. Pendaftaran</th>
                    <th style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'left' }}>NISN</th>
                    <th style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Nama Lengkap Siswa</th>
                    <th style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Jalur</th>
                    <th style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Nilai</th>
                    <th style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Sekolah Asal</th>
                  </tr>
                </thead>
                <tbody>
                  {acceptedStudents.length > 0 ? (
                    acceptedStudents.map((s, idx) => (
                      <tr key={s.id || s.no_pendaftaran} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{idx + 1}</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}>{s.id || s.no_pendaftaran}</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}>{s.nisn}</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 600 }}>{s.nama || s.nama_siswa}</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{s.jalur}</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 700, color: 'var(--primary)' }}>
                          {Number(s.nilaiRataRata || s.nilai_ujian || 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>{s.sekolahAsal || s.sekolah_asal}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ padding: '16px', textAlign: 'center', color: '#64748b' }}>
                        Belum ada peserta dengan status diterima. Lakukan penetapan pada modul Seleksi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Tanda Tangan */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', fontSize: '12px' }}>
                <div style={{ textAlign: 'center', width: '220px' }}>
                  <div>Mengetahui,</div>
                  <div>Kepala SMP Negeri 1 Harapan</div>
                  <div style={{ height: '65px' }}></div>
                  <div style={{ fontWeight: 800, textDecoration: 'underline' }}>{decreeData?.headmaster?.name || 'Drs. H. Ahmad Dahlan, M.Pd'}</div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>NIP. {decreeData?.headmaster?.nip || '19720514 199803 1 002'}</div>
                </div>

                <div style={{ textAlign: 'center', width: '220px' }}>
                  <div>Ditetapkan di: Harapan Jaya</div>
                  <div>Ketua Panitia PPDB 2026</div>
                  <div style={{ height: '65px' }}></div>
                  <div style={{ fontWeight: 800, textDecoration: 'underline' }}>{decreeData?.committeeHead?.name || 'Hj. Siti Rahmawati, S.Pd'}</div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>NIP. {decreeData?.committeeHead?.nip || '19800812 200501 2 004'}</div>
                </div>
              </div>
            </div>

            {/* Bottom Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button className="btn btn-outline" onClick={() => setShowPdfModal(false)}>
                Tutup
              </button>
              <button className="btn btn-primary" onClick={handlePrintOfficialPdf}>
                <Printer size={16} /> Buka Lembar Cetak / Simpan PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
