import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Tidak Ada Data',
  description = 'Belum ada data pendaftar atau entri yang cocok dengan filter yang Anda tentukan.',
  actionLabel,
  onAction
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '56px 20px',
        textAlign: 'center',
        background: '#ffffff',
        border: '1px dashed var(--border)',
        borderRadius: 'var(--radius-md)'
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}
      >
        <Icon size={32} />
      </div>
      <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '6px', color: 'var(--text)' }}>
        {title}
      </h3>
      <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', maxWidth: '420px', marginBottom: actionLabel ? '20px' : 0 }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button className="btn btn-outline btn-sm" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
