import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorBanner({
  title = 'Terjadi Kesalahan',
  message = 'Sistem mengalami kendala saat memuat atau memproses data. Silakan coba kembali.',
  onRetry
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--error-bg)',
        border: '1px solid var(--error-border)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        color: '#991b1b',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        marginBottom: '20px'
      }}
    >
      <AlertCircle size={22} style={{ color: 'var(--error)', flexShrink: 0, marginTop: '2px' }} />
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: '#991b1b', marginBottom: '4px' }}>
          {title}
        </h4>
        <p style={{ fontSize: '13px', color: '#7f1d1d', margin: 0 }}>
          {message}
        </p>
        {onRetry && (
          <button
            className="btn btn-outline btn-sm"
            onClick={onRetry}
            style={{ marginTop: '10px', borderColor: 'var(--error-border)', color: '#991b1b', background: '#ffffff' }}
          >
            <RefreshCw size={13} /> Coba Muat Ulang
          </button>
        )}
      </div>
    </div>
  );
}
