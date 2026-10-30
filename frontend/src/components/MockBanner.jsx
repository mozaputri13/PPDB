import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, User, X, ChevronUp, Cpu } from 'lucide-react';

export default function MockBanner() {
  const {
    currentUser,
    login,
    logout,
    globalSimState,
    setGlobalSimState,
    isBackendConnected
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top Professional Announcement Ribbon */}
      <div
        style={{
          background: 'linear-gradient(90deg, #064e3b 0%, #15803d 50%, #047857 100%)',
          color: '#ffffff',
          fontSize: '12px',
          padding: '6px 16px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          letterSpacing: '0.02em',
          position: 'relative',
          zIndex: 890,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <span className="badge-pulse" style={{ marginRight: '4px' }}>
          <span className="badge-dot" style={{ backgroundColor: '#4ade80' }}></span>
        </span>
        <span>
          📢 <strong>PPDB Tahun Ajaran 2026/2027 Resmi Dibuka</strong> — Kuota 216 Siswa • Pendaftaran Daring 100% Bebas Biaya
        </span>
      </div>

      {/* Floating Modern DevTools Pill in Bottom Right Corner */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999
        }}
      >
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              border: '1px solid #334155',
              padding: '8px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(0,0,0,0.35)',
              transition: 'var(--transition)'
            }}
            title="Klik untuk membuka Pengaturan Pengembang & Cepat Masuk"
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isBackendConnected ? '#22c55e' : '#eab308',
                boxShadow: isBackendConnected ? '0 0 8px #22c55e' : 'none'
              }}
            ></span>
            <span>DevTools</span>
            <ChevronUp size={14} style={{ color: '#94a3b8' }} />
          </button>
        ) : (
          <div
            style={{
              width: '320px',
              background: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
              fontSize: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#38bdf8' }}>
                <Cpu size={16} /> Panel Pengembang (DevTools)
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Backend status */}
            <div style={{ marginBottom: '12px', background: '#1e293b', padding: '8px 10px', borderRadius: '8px' }}>
              <div style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '2px' }}>Status Backend:</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: isBackendConnected ? '#4ade80' : '#facc15' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isBackendConnected ? '#4ade80' : '#facc15' }}></span>
                {isBackendConnected ? 'Aktif (Express + SQLite Port 3001)' : 'Menghubungkan...'}
              </div>
            </div>

            {/* State Simulation */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '6px' }}>Simulasi State Tampilan:</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                {['normal', 'loading', 'empty', 'error'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setGlobalSimState(st)}
                    style={{
                      padding: '4px',
                      borderRadius: '6px',
                      fontSize: '10.5px',
                      fontWeight: globalSimState === st ? 700 : 500,
                      background: globalSimState === st ? '#15803d' : '#1e293b',
                      color: globalSimState === st ? '#ffffff' : '#cbd5e1',
                      border: 'none',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick role switch */}
            <div>
              <div style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '6px' }}>Ganti Akun Cepat:</div>
              {!currentUser ? (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => login('student')}
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      background: '#15803d',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <User size={12} /> Masuk Siswa
                  </button>
                  <button
                    onClick={() => login('admin')}
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      background: '#0284c7',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <ShieldCheck size={12} /> Masuk Admin
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1e293b', padding: '6px 10px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
                    Login: <strong>{currentUser.nama || currentUser.role}</strong>
                  </span>
                  <button
                    onClick={logout}
                    style={{
                      background: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '10.5px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
