import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SCHOOL_INFO } from '../data/mockData';
import { GraduationCap, Menu, X, LogOut } from 'lucide-react';

export default function Navbar() {
  const { currentPage, navigateTo, currentUser, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page, param = null) => {
    navigateTo(page, param);
    setMobileMenuOpen(false);
  };

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 900,
        boxShadow: 'var(--shadow-xs)'
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        {/* Logo & Brand */}
        <div
          onClick={() => handleNav('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <GraduationCap size={26} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '17px', color: 'var(--primary)', lineHeight: 1.1 }}>
              PPDB Online
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
              {SCHOOL_INFO.name}
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          {/* Public Nav */}
          {(!currentUser || currentUser.role === 'student') && (
            <>
              <button
                onClick={() => handleNav('home')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'inherit',
                  fontSize: '14.5px',
                  fontWeight: currentPage === 'home' ? 700 : 500,
                  color: currentPage === 'home' ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                Beranda
              </button>
            </>
          )}

          {/* Student Logged In Nav */}
          {currentUser && currentUser.role === 'student' && (
            <>
              <button
                onClick={() => handleNav('student-dashboard')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'inherit',
                  fontSize: '14.5px',
                  fontWeight: currentPage === 'student-dashboard' ? 700 : 500,
                  color: currentPage === 'student-dashboard' ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                Status Pendaftaran
              </button>
              <button
                onClick={() => handleNav('form')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'inherit',
                  fontSize: '14.5px',
                  fontWeight: currentPage === 'form' ? 700 : 500,
                  color: currentPage === 'form' ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                Formulir Pendaftaran
              </button>
            </>
          )}

          {/* Admin Logged In Nav */}
          {currentUser && currentUser.role === 'admin' && (
            <>
              <button
                onClick={() => handleNav('admin-dashboard')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  fontWeight: currentPage === 'admin-dashboard' ? 700 : 500,
                  color: currentPage === 'admin-dashboard' ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                Dashboard Pendaftar
              </button>
              <button
                onClick={() => handleNav('verification')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  fontWeight: currentPage === 'verification' ? 700 : 500,
                  color: currentPage === 'verification' ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                Verifikasi Berkas
              </button>
              <button
                onClick={() => handleNav('selection')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  fontWeight: currentPage === 'selection' ? 700 : 500,
                  color: currentPage === 'selection' ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                Seleksi & Pengumuman
              </button>
              <button
                onClick={() => handleNav('reports')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  fontWeight: currentPage === 'reports' ? 700 : 500,
                  color: currentPage === 'reports' ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                Laporan & Ekspor
              </button>
            </>
          )}

          {/* Auth Actions */}
          {!currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => handleNav('auth', 'admin')}
              >
                Portal Panitia
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleNav('auth', 'siswa')}
              >
                Masuk / Daftar Siswa
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right', fontSize: '12px' }}>
                <div style={{ fontWeight: 700, color: 'var(--text)' }}>{currentUser.nama}</div>
                <div style={{ color: 'var(--text-muted)' }}>
                  {currentUser.role === 'admin' ? 'Panitia / Verifikator' : `NISN: ${currentUser.nisn}`}
                </div>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={logout}
                title="Keluar Akun"
                style={{ padding: '6px 10px' }}
              >
                <LogOut size={15} /> Keluar
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            color: 'var(--text)'
          }}
          className="mobile-toggle-btn"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid var(--border)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <button
            onClick={() => handleNav('home')}
            style={{ textAlign: 'left', padding: '8px 0', background: 'none', border: 'none', fontSize: '15px', fontWeight: 600 }}
          >
            Beranda
          </button>
          {currentUser && currentUser.role === 'student' && (
            <>
              <button
                onClick={() => handleNav('student-dashboard')}
                style={{ textAlign: 'left', padding: '8px 0', background: 'none', border: 'none', fontSize: '15px', fontWeight: 600 }}
              >
                Dashboard Calon Siswa
              </button>
              <button
                onClick={() => handleNav('form')}
                style={{ textAlign: 'left', padding: '8px 0', background: 'none', border: 'none', fontSize: '15px', fontWeight: 600 }}
              >
                Formulir Pendaftaran
              </button>
            </>
          )}
          {currentUser && currentUser.role === 'admin' && (
            <>
              <button
                onClick={() => handleNav('admin-dashboard')}
                style={{ textAlign: 'left', padding: '8px 0', background: 'none', border: 'none', fontSize: '15px', fontWeight: 600 }}
              >
                Dashboard Admin
              </button>
              <button
                onClick={() => handleNav('verification')}
                style={{ textAlign: 'left', padding: '8px 0', background: 'none', border: 'none', fontSize: '15px', fontWeight: 600 }}
              >
                Verifikasi Berkas
              </button>
              <button
                onClick={() => handleNav('selection')}
                style={{ textAlign: 'left', padding: '8px 0', background: 'none', border: 'none', fontSize: '15px', fontWeight: 600 }}
              >
                Seleksi & Hasil
              </button>
              <button
                onClick={() => handleNav('reports')}
                style={{ textAlign: 'left', padding: '8px 0', background: 'none', border: 'none', fontSize: '15px', fontWeight: 600 }}
              >
                Laporan & Ekspor
              </button>
            </>
          )}

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
            {!currentUser ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="btn btn-outline" onClick={() => handleNav('auth', 'admin')}>
                  Portal Panitia
                </button>
                <button className="btn btn-primary" onClick={() => handleNav('auth', 'siswa')}>
                  Masuk / Daftar Siswa
                </button>
              </div>
            ) : (
              <button className="btn btn-danger" style={{ width: '100%' }} onClick={logout}>
                <LogOut size={16} /> Keluar Akun
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .mobile-toggle-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
