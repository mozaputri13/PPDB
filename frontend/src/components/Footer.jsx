import React from 'react';
import { SCHOOL_INFO } from '../data/mockData';
import { GraduationCap, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border)', marginTop: '60px', padding: '48px 0 24px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '36px', marginBottom: '40px' }}>
          {/* Col 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={22} />
              </div>
              <strong style={{ fontSize: '16px', color: 'var(--primary)' }}>PPDB MTs/SMP Online</strong>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
              Sistem Informasi Penerimaan Peserta Didik Baru Terpadu Tahun Ajaran {SCHOOL_INFO.academicYear}.
              Memberikan kemudahan, transparansi, dan efisiensi bagi calon siswa dan sekolah.
            </p>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Standar SOT: <code>PRD.md</code> • <code>UI-GUIDELINE.md</code>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', color: 'var(--text)' }}>
              Kontak & Sekretariat PPDB
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <span>{SCHOOL_INFO.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>{SCHOOL_INFO.phone} (Pukul 08.00 - 15.00 WIB)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>{SCHOOL_INFO.email}</span>
              </div>
            </div>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', color: 'var(--text)' }}>
              Informasi Penting
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px' }}>
              <li><span style={{ color: 'var(--text-muted)' }}>Jadwal Pendaftaran:</span> <strong>{SCHOOL_INFO.registrationSchedule.start} – {SCHOOL_INFO.registrationSchedule.end}</strong></li>
              <li><span style={{ color: 'var(--text-muted)' }}>Pengumuman Hasil:</span> <strong>{SCHOOL_INFO.registrationSchedule.announcementDate}</strong></li>
              <li><span style={{ color: 'var(--text-muted)' }}>Total Daya Tampung:</span> <strong>{SCHOOL_INFO.quota.total} Siswa</strong></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <div>
            © 2026 {SCHOOL_INFO.name}. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Portal Front-End React + Vite</span>
            <span>•</span>
            <span>Bukan Aplikasi Produksi (Data Mock)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
