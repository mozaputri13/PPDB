import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Trash2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export default function RegistrationForm() {
  const { currentUser, submitRegistration } = useApp();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Biodata
    nisn: currentUser?.nisn || '0098765432',
    nik: '3201123456780001',
    nama: currentUser?.nama || 'Muhammad Rayhan Pratama',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2013-05-14',
    jenisKelamin: 'Laki-laki',
    agama: 'Islam',
    alamat: 'Jl. Melati No. 15, RT 02/RW 04, Kelurahan Harapan Jaya, Kecamatan Cempaka Putih',
    jalur: 'Reguler',

    // Step 2: Data Ortu
    namaAyah: 'Ahmad Pratama',
    pekerjaanAyah: 'Wiraswasta',
    namaIbu: 'Siti Rahayu',
    pekerjaanIbu: 'Guru SD',
    whatsappOrtu: '081298765432',

    // Step 3: Sekolah Asal
    sekolahAsal: 'MIN 1 Kota Mandiri',
    npsnAsal: '60102030',
    tahunLulus: '2026',
    nilaiRataRata: '91.45',

    // Step 4: Berkas
    dokumen: {
      kk: { name: 'Kartu_Keluarga_Rayhan.pdf', size: '1.2 MB', uploaded: true },
      akta: { name: 'Akta_Kelahiran_Rayhan.pdf', size: '950 KB', uploaded: true },
      pasfoto: { name: 'Pasfoto_3x4_Resmi.jpg', size: '420 KB', uploaded: true },
      skl: { name: 'SKL_Sementara_MIN1.pdf', size: '820 KB', uploaded: true }
    }
  });

  const [statementAgreed, setStatementAgreed] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleFileUpload = (docKey, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 2 MB limit check
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg(`Ukuran berkas ${file.name} melebihi 2 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB). Harap perkecil ukuran berkas.`);
      return;
    }

    const sizeStr = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    setFormData({
      ...formData,
      dokumen: {
        ...formData.dokumen,
        [docKey]: {
          name: file.name,
          size: sizeStr,
          uploaded: true
        }
      }
    });
    setErrorMsg('');
  };

  const removeDoc = (docKey) => {
    setFormData({
      ...formData,
      dokumen: {
        ...formData.dokumen,
        [docKey]: { name: '', size: '', uploaded: false }
      }
    });
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.nama || !formData.nik || !formData.tempatLahir || !formData.alamat) {
        setErrorMsg('Harap lengkapi semua field bertanda bintang (*).');
        return false;
      }
      if (formData.nik.length < 16) {
        setErrorMsg('NIK harus terdiri dari 16 digit angka sesuai Kartu Keluarga.');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.namaAyah || !formData.namaIbu || !formData.whatsappOrtu) {
        setErrorMsg('Harap lengkapi nama orang tua dan nomor WhatsApp aktif.');
        return false;
      }
    }
    if (step === 3) {
      if (!formData.sekolahAsal || !formData.nilaiRataRata) {
        setErrorMsg('Harap lengkapi nama sekolah asal dan nilai rata-rata.');
        return false;
      }
    }
    if (step === 4) {
      const allDocsUploaded = Object.values(formData.dokumen).every((d) => d.uploaded);
      if (!allDocsUploaded) {
        setErrorMsg('Seluruh 4 berkas persyaratan wajib diunggah sebelum melanjutkan.');
        return false;
      }
    }
    setErrorMsg('');
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setErrorMsg('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!statementAgreed) {
      setErrorMsg('Anda wajib menyetujui pernyataan kebenaran data sebelum mengirim pendaftaran.');
      return;
    }
    submitRegistration(formData);
  };

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '880px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>
          Formulir Pendaftaran Siswa Baru
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Isi setiap bagian dengan teliti sesuai dokumen kependudukan dan rapor resmi
        </p>
      </div>

      {/* Stepper Navigation */}
      <div className="stepper-nav">
        {[
          { num: 1, title: 'Biodata Siswa' },
          { num: 2, title: 'Data Orang Tua' },
          { num: 3, title: 'Sekolah Asal' },
          { num: 4, title: 'Unggah Berkas' },
          { num: 5, title: 'Ringkasan & Kirim' }
        ].map((s) => (
          <div
            key={s.num}
            className={`stepper-step ${currentStep === s.num ? 'active' : ''} ${currentStep > s.num ? 'completed' : ''}`}
          >
            <div className="stepper-circle">
              {currentStep > s.num ? <CheckCircle2 size={18} /> : s.num}
            </div>
            <div className="stepper-title">{s.title}</div>
          </div>
        ))}
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div
          style={{
            backgroundColor: 'var(--error-bg)',
            border: '1px solid var(--error-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            fontSize: '13.5px',
            color: 'var(--error)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px'
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step Form Box */}
      <div className="card" style={{ padding: '32px' }}>
        {/* ==============================================================
            STEP 1: BIODATA CALON SISWA
            ============================================================== */}
        {currentStep === 1 && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              Langkah 1: Biodata Calon Siswa
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
              <div className="form-group">
                <label className="form-label">Nomor Induk Siswa Nasional (NISN) <span className="req">*</span></label>
                <input type="text" name="nisn" className="form-input" value={formData.nisn} readOnly style={{ background: '#f8faf9' }} />
                <div className="form-hint">Terkunci sesuai akun login</div>
              </div>

              <div className="form-group">
                <label className="form-label">Nomor Induk Kependudukan (NIK) <span className="req">*</span></label>
                <input type="text" name="nik" className="form-input" value={formData.nik} onChange={handleChange} maxLength={16} placeholder="16 digit sesuai KK" />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Nama Lengkap Siswa <span className="req">*</span></label>
                <input type="text" name="nama" className="form-input" value={formData.nama} onChange={handleChange} placeholder="Sesuai Akta Kelahiran" />
              </div>

              <div className="form-group">
                <label className="form-label">Tempat Lahir <span className="req">*</span></label>
                <input type="text" name="tempatLahir" className="form-input" value={formData.tempatLahir} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Tanggal Lahir <span className="req">*</span></label>
                <input type="date" name="tanggalLahir" className="form-input" value={formData.tanggalLahir} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Jenis Kelamin <span className="req">*</span></label>
                <select name="jenisKelamin" className="form-select" value={formData.jenisKelamin} onChange={handleChange}>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Agama <span className="req">*</span></label>
                <select name="agama" className="form-select" value={formData.agama} onChange={handleChange}>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Pilihan Jalur Pendaftaran <span className="req">*</span></label>
                <select name="jalur" className="form-select" value={formData.jalur} onChange={handleChange}>
                  <option value="Reguler">Jalur Reguler (Umum)</option>
                  <option value="Prestasi">Jalur Prestasi (Akademik / Non-Akademik)</option>
                  <option value="Afirmasi">Jalur Afirmasi (Keluarga Pra-Sejahtera / KIP)</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Alamat Tempat Tinggal Lengkap <span className="req">*</span></label>
                <textarea name="alamat" rows={3} className="form-textarea" value={formData.alamat} onChange={handleChange} placeholder="Nama Jalan, RT/RW, Kelurahan, Kecamatan" />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button className="btn btn-primary" onClick={nextStep}>
                Lanjut: Data Orang Tua <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ==============================================================
            STEP 2: DATA ORANG TUA / WALI
            ============================================================== */}
        {currentStep === 2 && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              Langkah 2: Data Orang Tua / Wali
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
              <div className="form-group">
                <label className="form-label">Nama Lengkap Ayah Kandung <span className="req">*</span></label>
                <input type="text" name="namaAyah" className="form-input" value={formData.namaAyah} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Pekerjaan Ayah <span className="req">*</span></label>
                <input type="text" name="pekerjaanAyah" className="form-input" value={formData.pekerjaanAyah} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Nama Lengkap Ibu Kandung <span className="req">*</span></label>
                <input type="text" name="namaIbu" className="form-input" value={formData.namaIbu} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Pekerjaan Ibu <span className="req">*</span></label>
                <input type="text" name="pekerjaanIbu" className="form-input" value={formData.pekerjaanIbu} onChange={handleChange} />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Nomor WhatsApp Orang Tua / Wali yang Aktif <span className="req">*</span></label>
                <input type="tel" name="whatsappOrtu" className="form-input" value={formData.whatsappOrtu} onChange={handleChange} placeholder="Contoh: 081234567890" />
                <div className="form-hint">Digunakan panitia jika ada berkas yang perlu perbaikan (revisi).</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button className="btn btn-outline" onClick={prevStep}>
                <ArrowLeft size={16} /> Kembali
              </button>
              <button className="btn btn-primary" onClick={nextStep}>
                Lanjut: Sekolah Asal <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ==============================================================
            STEP 3: DATA SEKOLAH ASAL SD/MI
            ============================================================== */}
        {currentStep === 3 && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              Langkah 3: Data Sekolah Asal (SD / MI)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Nama Sekolah Asal SD/MI <span className="req">*</span></label>
                <input type="text" name="sekolahAsal" className="form-input" value={formData.sekolahAsal} onChange={handleChange} placeholder="Contoh: MIN 1 Kota Mandiri / SDN 04 Maju" />
              </div>

              <div className="form-group">
                <label className="form-label">NPSN Sekolah Asal</label>
                <input type="text" name="npsnAsal" className="form-input" value={formData.npsnAsal} onChange={handleChange} placeholder="8 digit NPSN jika diketahui" />
              </div>

              <div className="form-group">
                <label className="form-label">Tahun Lulus <span className="req">*</span></label>
                <select name="tahunLulus" className="form-select" value={formData.tahunLulus} onChange={handleChange}>
                  <option value="2026">2026 (Lulusan Baru)</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Nilai Rata-rata Raport / Ujian Akhir <span className="req">*</span></label>
                <input type="number" step="0.01" name="nilaiRataRata" className="form-input" value={formData.nilaiRataRata} onChange={handleChange} placeholder="Contoh: 89.50" />
                <div className="form-hint">Digunakan panitia untuk pembobotan seleksi peringkat</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button className="btn btn-outline" onClick={prevStep}>
                <ArrowLeft size={16} /> Kembali
              </button>
              <button className="btn btn-primary" onClick={nextStep}>
                Lanjut: Unggah Berkas <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ==============================================================
            STEP 4: UNGGAH DOKUMEN BERKAS
            ============================================================== */}
        {currentStep === 4 && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              Langkah 4: Unggah Berkas Persyaratan (PDF/JPG/PNG, Maks. 2MB)
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '22px' }}>
              Seluruh berkas di bawah ini wajib diunggah. Pastikan gambar jelas dan tidak terpotong.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {[
                { key: 'kk', label: '1. Kartu Keluarga (KK)', desc: 'Format PDF atau scan JPG, maksimal 2 MB' },
                { key: 'akta', label: '2. Akta Kelahiran', desc: 'Format PDF atau scan JPG, maksimal 2 MB' },
                { key: 'pasfoto', label: '3. Pasfoto 3x4 Resmi', desc: 'Format JPG atau PNG rapi latar merah/biru, maksimal 2 MB' },
                { key: 'skl', label: '4. Ijazah / SKL SD/MI', desc: 'Surat Keterangan Lulus resmi dari sekolah asal, maksimal 2 MB' }
              ].map((item) => {
                const doc = formData.dokumen[item.key];
                return (
                  <div key={item.key} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '16px 20px', background: '#fafcfb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div>
                        <strong style={{ fontSize: '14.5px', color: 'var(--text)' }}>{item.label}</strong>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.desc}</div>
                      </div>
                      {doc.uploaded ? (
                        <span className="badge badge-accepted">
                          <CheckCircle2 size={12} /> Terunggah
                        </span>
                      ) : (
                        <span className="badge badge-draft">Belum Diunggah</span>
                      )}
                    </div>

                    {doc.uploaded ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px' }}>
                          <FileText size={18} style={{ color: 'var(--primary)' }} />
                          <span><strong>{doc.name}</strong> ({doc.size})</span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--error)', borderColor: 'var(--error-border)' }}
                          onClick={() => removeDoc(item.key)}
                        >
                          <Trash2 size={14} /> Ganti
                        </button>
                      </div>
                    ) : (
                      <label style={{ display: 'block', border: '2px dashed var(--border)', borderRadius: 'var(--radius-sm)', padding: '20px', textAlign: 'center', cursor: 'pointer', background: '#ffffff', transition: 'var(--transition)' }}>
                        <Upload size={24} style={{ color: 'var(--primary)', margin: '0 auto 6px' }} />
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                          Klik untuk Memilih Berkas
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                          PDF, JPG, atau PNG (Maks 2 MB)
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileUpload(item.key, e)}
                        />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button className="btn btn-outline" onClick={prevStep}>
                <ArrowLeft size={16} /> Kembali
              </button>
              <button className="btn btn-primary" onClick={nextStep}>
                Lanjut: Ringkasan & Konfirmasi <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ==============================================================
            STEP 5: RINGKASAN & KONFIRMASI PENGIRIMAN
            ============================================================== */}
        {currentStep === 5 && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              Langkah 5: Konfirmasi & Kirim Pendaftaran
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '22px' }}>
              Mohon periksa kembali data pendaftaran di bawah ini sebelum mengirim ke sistem panitia.
            </p>

            {/* Summary Box */}
            <div style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', fontSize: '13.5px' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Nama Calon Siswa:</span><br /><strong>{formData.nama}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>NISN:</span><br /><strong>{formData.nisn}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>NIK:</span><br /><strong>{formData.nik}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Jalur Pendaftaran:</span><br /><strong>{formData.jalur}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Sekolah Asal:</span><br /><strong>{formData.sekolahAsal}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Nilai Rata-rata:</span><br /><strong>{formData.nilaiRataRata}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>No. WhatsApp Ortu:</span><br /><strong>{formData.whatsappOrtu}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Kelengkapan Berkas:</span><br /><strong style={{ color: 'var(--primary)' }}>4 dari 4 Dokumen Terunggah</strong></div>
              </div>
            </div>

            {/* Statement Checkbox */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: '#ffffff', marginBottom: '24px' }}>
              <input
                type="checkbox"
                id="statement"
                checked={statementAgreed}
                onChange={(e) => setStatementAgreed(e.target.checked)}
                style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer' }}
              />
              <label htmlFor="statement" style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text)', cursor: 'pointer' }}>
                <strong>Surat Pernyataan Tanggung Jawab Mutlak:</strong> Saya menyatakan bahwa seluruh data dan dokumen yang saya unggah adalah benar, sah, dan dapat dipertanggungjawabkan. Apabila di kemudian hari ditemukan pemalsuan berkas, saya bersedia menerima sanksi pembatalan status pendaftaran dan kelulusan.
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-outline" onClick={prevStep}>
                <ArrowLeft size={16} /> Periksa Berkas
              </button>
              <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
                <CheckCircle2 size={18} /> Kirim Pendaftaran Sekarang ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
