import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        backgroundColor: isSuccess ? '#166534' : isError ? '#991b1b' : '#075985',
        color: '#ffffff',
        padding: '12px 18px',
        borderRadius: 'var(--radius-sm)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '13.5px',
        fontWeight: 500,
        maxWidth: '420px',
        animation: 'slideUp 0.25s ease'
      }}
    >
      {isSuccess && <CheckCircle2 size={18} />}
      {isError && <AlertCircle size={18} />}
      {!isSuccess && !isError && <Info size={18} />}
      <span>{toast.message}</span>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
