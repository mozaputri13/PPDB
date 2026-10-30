import React from 'react';
import { SCHOOL_INFO } from '../data/mockData';
import { GraduationCap, Phone, Mail, MapPin, ShieldCheck, Clock, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#f8fafc', borderTop: '1px solid #1e293b', marginTop: '60px', padding: '56px 0 28px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '40px', marginBottom: '44px' }}>
          {/* Col 1: Identity */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(21, 128, 61, 0.4)' }}>
                <GraduationCap size={24} />
              </div>
              <div>
                <strong style={{ fontSize: '17px', color: '#ffffff', display: 'block', lineHeight: 1.2 }}>PPDB Online</strong>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Portal Penerimaan Siswa Baru</span>
              </div>
            </div>
            <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.65, marginBottom: '16px' }}>
              Sistem Informasi Penerimaan Peserta Didik Baru (PPDB) daring resmi {SCHOOL_INFO.name}.
              Transparan, akuntabel, dan bebas biaya untuk seluruh calon peserta didik.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#4ade80' }}>
              <Award size={16} /> <span>Terakreditasi A (Unggul) • Badan Akreditasi Nasional</span>
            </div>
          </div>

          {/* Col 2: Contact */}
          <div>
            <h4 style={{ fontSize: '15.5px', fontWeight: 700, marginBottom: '16px', color: '#ffffff' }}>
              Sekretariat & Layanan Panitia
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} />
                <span>{SCHOOL_INFO.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
                <span>{SCHOOL_INFO.phone} (Hotline Resmi)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
                <span>Senin – Sabtu, 08.00 – 15.00 WIB</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
                <span>{SCHOOL_INFO.email}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Info & Privacy */}
          <div>
            <h4 style={{ fontSize: '15.5px', fontWeight: 700, marginBottom: '16px', color: '#ffffff' }}>
              Informasi & Kebijakan
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: '#94a3b8' }}>
              <li><span>Tahun Ajaran:</span> <strong style={{ color: '#ffffff' }}>{SCHOOL_INFO.academicYear}</strong></li>
              <li><span>Daya Tampung:</span> <strong style={{ color: '#4ade80' }}>{SCHOOL_INFO.quota.total} Peserta Didik</strong></li>
              <li><span>Pengumuman Kelulusan:</span> <strong style={{ color: '#ffffff' }}>{SCHOOL_INFO.registrationSchedule.announcementDate}</strong></li>
              <li style={{ borderTop: '1px solid #1e293b', paddingTop: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
                <ShieldCheck size={16} style={{ color: '#38bdf8' }} /> Dilindungi Undang-Undang Privasi Data (UU PDP)
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '12.5px', color: '#64748b' }}>
          <div>
            © 2026 {SCHOOL_INFO.name}. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Portal Resmi PPDB Terpadu</span>
            <span>•</span>
            <span>Kementerian Agama & Dinas Pendidikan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
