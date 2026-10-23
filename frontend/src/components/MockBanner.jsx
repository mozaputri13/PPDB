import React from 'react';
import { useApp } from '../context/AppContext';
import { Info, User, ShieldCheck } from 'lucide-react';

export default function MockBanner() {
  const {
    currentUser,
    login,
    logout,
    globalSimState,
    setGlobalSimState,
    isBackendConnected
  } = useApp();

  return (
    <div
      style={{
        backgroundColor: '#173126',
        color: '#ffffff',
        padding: '8px 16px',
        fontSize: '12.5px',
        borderBottom: '1px solid #234636',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        zIndex: 1000,
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            backgroundColor: isBackendConnected ? '#16834a' : '#238653',
            color: '#ffffff',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '999px',
            fontSize: '11px',
            letterSpacing: '0.04em'
          }}
        >
          {isBackendConnected ? 'FASE 4 • TERINTEGRASI BACKEND API' : 'FASE 4 • INTEGRASI ALUR PPDB'}
        </span>
        <span style={{ color: '#d1fae5', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isBackendConnected ? (
            <>🟢 Server Backend & SQLite Aktif (Port 3001)</>
          ) : (
            <><Info size={14} /> Menghubungkan ke Backend...</>
          )}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* State Simulator Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#234636', padding: '2px', borderRadius: '6px' }}>
          <span style={{ padding: '0 6px', color: '#94a3b8', fontSize: '11px' }}>Simulasi State:</span>
          {['normal', 'loading', 'empty', 'error'].map((st) => (
            <button
              key={st}
              onClick={() => setGlobalSimState(st)}
              style={{
                background: globalSimState === st ? '#ffffff' : 'transparent',
                color: globalSimState === st ? '#173126' : '#cbd5e1',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '11px',
                fontWeight: globalSimState === st ? 700 : 500,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Quick Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#94a3b8', fontSize: '11px' }}>Peran Cepat:</span>
          {!currentUser ? (
            <>
              <button
                className="btn btn-sm"
                onClick={() => login('student')}
                style={{ padding: '3px 8px', fontSize: '11px', background: '#234636', color: '#fff', border: '1px solid #33614b' }}
              >
                <User size={12} /> Masuk sbg Siswa
              </button>
              <button
                className="btn btn-sm"
                onClick={() => login('admin')}
                style={{ padding: '3px 8px', fontSize: '11px', background: '#234636', color: '#fff', border: '1px solid #33614b' }}
              >
                <ShieldCheck size={12} /> Masuk sbg Admin
              </button>
            </>
          ) : (
            <button
              className="btn btn-sm"
              onClick={logout}
              style={{ padding: '3px 8px', fontSize: '11px', background: '#dc2626', color: '#fff', border: 'none' }}
            >
              Keluar ({currentUser.role === 'admin' ? 'Admin' : 'Siswa'})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
