import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary tertangkap:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-light)',
            padding: '24px'
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '540px',
              width: '100%',
              padding: '36px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg)',
              borderTop: '4px solid var(--danger)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}
            >
              <AlertTriangle size={34} />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>
              Terjadi Kendala pada Antarmuka
            </h2>

            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '24px' }}>
              Mohon maaf, sistem PPDB mengalami kendala teknis saat merender halaman ini. Data pendaftaran Anda tetap tersimpan dengan aman di server.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={this.handleReload}>
                <RefreshCw size={16} /> Muat Ulang Halaman
              </button>
              <button className="btn btn-outline" onClick={this.handleReset}>
                <Home size={16} /> Kembali ke Beranda
              </button>
            </div>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <details
                style={{
                  marginTop: '24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  backgroundColor: '#f8fafc',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  color: '#64748b'
                }}
              >
                <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Detail Teknis (Pengembang)</summary>
                <pre style={{ marginTop: '8px', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
