import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, ShieldCheck, AlertCircle } from 'lucide-react';
import ErrorBanner from '../components/ErrorBanner';

export default function AuthPage() {
  const { login, pageParam, globalSimState } = useApp();

  // Role tab: 'student' or 'admin'
  const initialRole = pageParam === 'admin' ? 'admin' : 'student';
  const initialMode = pageParam === 'register' ? 'register' : 'login';

  const [roleTab, setRoleTab] = useState(initialRole);
  const [studentMode, setStudentMode] = useState(initialMode);

  // Form states
  const [formData, setFormData] = useState({
    nisn: '0098765432',
    nama: 'Muhammad Rayhan Pratama',
    email: 'rayhan.pratama@gmail.com',
    password: 'password123',
    confirmPassword: 'password123',
    adminEmail: 'panitia.ppdb@smpn1harapan.sch.id',
    adminPassword: 'password123'
  });

  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (!formData.nisn || formData.nisn.length < 10) {
      setFormError('NISN wajib diisi tepat 10 digit angka resmi.');
      return;
    }
    if (studentMode === 'register' && formData.password !== formData.confirmPassword) {
      setFormError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    // Authenticate as student
    login('student');
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (!formData.adminEmail || !formData.adminPassword) {
      setFormError('Email petugas dan kata sandi wajib diisi.');
      return;
    }

    // Authenticate as admin
    login('admin');
  };

  return (
    <div style={{ padding: '60px 20px', minHeight: 'calc(100vh - 180px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '460px', padding: '32px 28px', boxShadow: 'var(--shadow-md)' }}>
        
        {/* Role Switcher Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', marginBottom: '24px' }}>
          <button
            onClick={() => { setRoleTab('student'); setFormError(''); }}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              padding: '10px 0',
              fontFamily: 'inherit',
              fontSize: '14.5px',
              fontWeight: roleTab === 'student' ? 700 : 500,
              color: roleTab === 'student' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: roleTab === 'student' ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: '-2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <User size={16} /> Calon Siswa
          </button>
          <button
            onClick={() => { setRoleTab('admin'); setFormError(''); }}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              padding: '10px 0',
              fontFamily: 'inherit',
              fontSize: '14.5px',
              fontWeight: roleTab === 'admin' ? 700 : 500,
              color: roleTab === 'admin' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: roleTab === 'admin' ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: '-2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={16} /> Panitia / Admin
          </button>
        </div>

        {/* Global Error Banner Simulation */}
        {globalSimState === 'error' && (
          <ErrorBanner
            title="Koneksi Autentikasi Gagal"
            message="Server mock sedang dalam kondisi simulasi error."
          />
        )}

        {/* Validation Error Message */}
        {formError && (
          <div
            style={{
              backgroundColor: 'var(--error-bg)',
              border: '1px solid var(--error-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              fontSize: '13px',
              color: 'var(--error)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '18px'
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{formError}</span>
          </div>
        )}

        {/* ==============================================================
            TAB SISWA: LOGIN / REGISTER
            ============================================================== */}
        {roleTab === 'student' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800 }}>
                  {studentMode === 'register' ? 'Daftar Akun Calon Siswa' : 'Masuk Akun Calon Siswa'}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {studentMode === 'register' ? 'Lengkapi data awal untuk memulai pendaftaran' : 'Pantau formulir dan status pendaftaran Anda'}
                </p>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setStudentMode(studentMode === 'register' ? 'login' : 'register');
                  setFormError('');
                }}
              >
                {studentMode === 'register' ? 'Masuk' : 'Daftar Baru'}
              </button>
            </div>

            <form onSubmit={handleStudentSubmit}>
              {studentMode === 'register' && (
                <div className="form-group">
                  <label className="form-label">
                    Nama Lengkap Calon Siswa <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama"
                    className="form-input"
                    placeholder="Sesuai Akta Kelahiran"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  Nomor Induk Siswa Nasional (NISN) <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="nisn"
                  className="form-input"
                  placeholder="Contoh: 0098765432"
                  maxLength={10}
                  value={formData.nisn}
                  onChange={handleChange}
                  required
                />
                <div className="form-hint">10 digit angka resmi dari Kemdikbud/Kemenag</div>
              </div>

              {studentMode === 'register' && (
                <div className="form-group">
                  <label className="form-label">
                    Email Aktif Orang Tua / Siswa <span className="req">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="contoh@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  Kata Sandi <span className="req">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {studentMode === 'register' && (
                <div className="form-group">
                  <label className="form-label">
                    Ulangi Kata Sandi <span className="req">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-input"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                {studentMode === 'register' ? 'Buat Akun Siswa Baru →' : 'Masuk ke Dashboard Siswa →'}
              </button>
            </form>
          </div>
        )}

        {/* ==============================================================
            TAB ADMIN / PANITIA: PORTAL TERTUTUP
            ============================================================== */}
        {roleTab === 'admin' && (
          <div>
            <div style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Portal Panitia PPDB</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Akses terbatas untuk verifikator dan administrator resmi sekolah.
              </p>
            </div>

            <form onSubmit={handleAdminSubmit}>
              <div className="form-group">
                <label className="form-label">
                  Email / NIP Petugas Panitia <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="adminEmail"
                  className="form-input"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Kata Sandi Petugas <span className="req">*</span>
                </label>
                <input
                  type="password"
                  name="adminPassword"
                  className="form-input"
                  value={formData.adminPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                Masuk ke Panel Verifikator Admin →
              </button>
            </form>

            <div
              style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border)',
                fontSize: '12px',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                textAlign: 'center'
              }}
            >
              🔒 <strong>Catatan Keamanan:</strong> Akun admin disiapkan langsung oleh sekolah dan tidak memiliki pendaftaran terbuka bagi publik.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
