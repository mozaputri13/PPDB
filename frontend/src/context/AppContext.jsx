import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_APPLICANTS, MOCK_USERS, REGISTRATION_STATUSES } from '../data/mockData';
import { api } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Routing / View State: 'home', 'auth', 'form', 'student-dashboard', 'admin-dashboard', 'verification', 'selection', 'reports'
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParam, setPageParam] = useState(null);

  // User Auth State: null (guest), student object, or admin object
  const [currentUser, setCurrentUser] = useState(null);

  // Master Applicants Data
  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);

  // Selected applicant for detailed admin verification panel
  const [selectedApplicantId, setSelectedApplicantId] = useState('PPDB-2026-00412');

  // Announcement publication flag (Admin controls this)
  const [isAnnouncementPublished, setIsAnnouncementPublished] = useState(false);

  // Global Edge State Simulator: 'normal', 'loading', 'empty', 'error'
  const [globalSimState, setGlobalSimState] = useState('normal');

  // Backend connection status
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const navigateTo = (page, param = null) => {
    setCurrentPage(page);
    setPageParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync data with backend on load
  const refreshBackendData = async () => {
    try {
      await api.getPublicInfo();
      setIsBackendConnected(true);

      const ann = await api.getPublicAnnouncement();
      if (ann && typeof ann.isPublished === 'boolean') {
        setIsAnnouncementPublished(ann.isPublished);
      }

      // If user is admin, fetch real applicants list
      const token = localStorage.getItem('ppdb_token');
      if (token && currentUser?.role === 'admin') {
        const res = await api.getAdminApplicants();
        if (res && res.applicants && res.applicants.length > 0) {
          // Normalize applicant format
          const formatted = res.applicants.map((a) => ({
            id: a.id,
            nisn: a.nisn,
            nama: a.nama,
            jenisKelamin: a.jenisKelamin || 'Laki-laki',
            sekolahAsal: a.sekolahAsal || 'SD Asal',
            nilaiRataRata: a.nilaiRataRata || 85.0,
            jalur: a.jalur || 'Reguler',
            status: a.status || REGISTRATION_STATUSES.SUBMITTED,
            revisiNote: a.revisi_notes || '',
            dokumen: {
              kk: { name: `KK_${a.nama}.pdf`, size: '1.2 MB', uploaded: true },
              akta: { name: `Akta_${a.nama}.pdf`, size: '950 KB', uploaded: true },
              pasfoto: { name: `Foto_${a.nama}.jpg`, size: '420 KB', uploaded: true },
              skl: { name: `SKL_${a.nama}.pdf`, size: '820 KB', uploaded: true }
            }
          }));
          setApplicants(formatted);
        }
      }
    } catch {
      // Backend not running or unreachable, fallback to memory mock
      setIsBackendConnected(false);
    }
  };

  useEffect(() => {
    refreshBackendData();
  }, [currentUser]);

  // Login handler
  const login = async (role, credentials = null) => {
    try {
      let identifier = credentials?.identifier;
      let password = credentials?.password || 'password123';

      if (!identifier) {
        identifier = role === 'admin'
          ? 'panitia.ppdb@smpn1harapan.sch.id'
          : '0098765432';
      }

      // Try backend login
      const res = await api.login(identifier, password);
      if (res && res.token) {
        localStorage.setItem('ppdb_token', res.token);
        setCurrentUser(res.user);
        setIsBackendConnected(true);

        if (res.user.role === 'admin') {
          navigateTo('admin-dashboard');
          showToast(`Berhasil masuk sebagai Panitia (${res.user.nama})`, 'success');
        } else {
          navigateTo('student-dashboard');
          showToast(`Berhasil masuk sebagai Calon Siswa (${res.user.nama})`, 'success');
        }
        return;
      }
    } catch {
      // Fallback to local mock auth if backend endpoint is unavailable
    }

    // Local fallback
    if (role === 'admin') {
      setCurrentUser(MOCK_USERS.admin);
      navigateTo('admin-dashboard');
      showToast('Berhasil masuk sebagai Panitia PPDB (Admin)', 'success');
    } else {
      setCurrentUser(MOCK_USERS.student);
      navigateTo('student-dashboard');
      showToast('Berhasil masuk sebagai Calon Siswa', 'success');
    }
  };

  const logout = () => {
    localStorage.removeItem('ppdb_token');
    setCurrentUser(null);
    navigateTo('home');
    showToast('Anda telah keluar dari sistem.', 'info');
  };

  // Submit new registration from student form
  const submitRegistration = async (newRecord) => {
    try {
      // Try backend save and submit
      await api.saveStudentRegistration(newRecord);
      await api.submitRegistration();
      setIsBackendConnected(true);
    } catch {
      // In-memory fallback
    }

    const id = newRecord.id || `PPDB-2026-${String(Math.floor(400 + Math.random() * 99)).padStart(5, '0')}`;
    const formatted = {
      id,
      nisn: newRecord.nisn || '0098765432',
      nik: newRecord.nik || '3201123456780099',
      nama: newRecord.nama || 'Muhammad Rayhan Pratama',
      tempatLahir: newRecord.tempatLahir || 'Jakarta',
      tanggalLahir: newRecord.tanggalLahir || '2013-05-14',
      jenisKelamin: newRecord.jenisKelamin || 'Laki-laki',
      agama: newRecord.agama || 'Islam',
      alamat: newRecord.alamat || 'Jl. Melati No. 15',
      namaAyah: newRecord.namaAyah || 'Ahmad Pratama',
      pekerjaanAyah: newRecord.pekerjaanAyah || 'Wiraswasta',
      namaIbu: newRecord.namaIbu || 'Siti Rahayu',
      pekerjaanIbu: newRecord.pekerjaanIbu || 'Guru',
      whatsappOrtu: newRecord.whatsappOrtu || '081298765432',
      sekolahAsal: newRecord.sekolahAsal || 'MIN 1 Kota Mandiri',
      npsnAsal: newRecord.npsnAsal || '60102030',
      tahunLulus: newRecord.tahunLulus || '2026',
      nilaiRataRata: parseFloat(newRecord.nilaiRataRata) || 89.5,
      jalur: newRecord.jalur || 'Reguler',
      waktuDaftar: 'Baru saja',
      status: REGISTRATION_STATUSES.SUBMITTED,
      revisiNote: '',
      dokumen: newRecord.dokumen || {
        kk: { name: 'Kartu_Keluarga.pdf', size: '1.2 MB', uploaded: true },
        akta: { name: 'Akta_Kelahiran.pdf', size: '980 KB', uploaded: true },
        pasfoto: { name: 'Pasfoto_3x4.jpg', size: '410 KB', uploaded: true },
        skl: { name: 'Ijazah_SKL.pdf', size: '850 KB', uploaded: true }
      }
    };

    setApplicants((prev) => [formatted, ...prev]);
    if (!currentUser) setCurrentUser(MOCK_USERS.student);
    navigateTo('student-dashboard');
    showToast('Pendaftaran Anda berhasil dikirim ke Panitia!', 'success');
  };

  // Admin updates applicant verification status
  const updateApplicantStatus = async (id, newStatus, revisiNote = '') => {
    try {
      if (newStatus === REGISTRATION_STATUSES.VERIFIED) {
        await api.verifyApplicant(id);
      } else if (newStatus === REGISTRATION_STATUSES.NEEDS_REVISION) {
        await api.requestRevision(id, revisiNote);
      } else if (newStatus === REGISTRATION_STATUSES.NOT_ACCEPTED) {
        await api.rejectApplicant(id);
      }
    } catch {
      // In-memory fallback
    }

    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          return {
            ...app,
            status: newStatus,
            revisiNote: revisiNote || app.revisiNote
          };
        }
        return app;
      })
    );
    showToast(`Status pendaftaran ${id} diperbarui menjadi "${newStatus}".`, 'success');
  };

  // Toggle selection decision (Accepted / Not Accepted)
  const setSelectionDecision = async (id, decision) => {
    try {
      await api.setSelectionDecision(id, decision);
    } catch {
      // In-memory fallback
    }

    setApplicants((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: decision } : app))
    );
    showToast(`Keputusan seleksi ${id} ditetapkan: ${decision}`, 'info');
  };

  const togglePublishAnnouncement = async () => {
    try {
      const res = await api.togglePublishAnnouncement();
      if (res && typeof res.isAnnouncementPublished === 'boolean') {
        setIsAnnouncementPublished(res.isAnnouncementPublished);
        showToast(res.message, 'success');
        return;
      }
    } catch {
      // In-memory fallback
    }

    setIsAnnouncementPublished((prev) => {
      const next = !prev;
      showToast(
        next
          ? 'Pengumuman hasil seleksi BERHASIL DITERBITKAN ke seluruh siswa!'
          : 'Pengumuman ditarik kembali ke DRAFT.',
        next ? 'success' : 'info'
      );
      return next;
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        pageParam,
        navigateTo,
        currentUser,
        login,
        logout,
        applicants,
        selectedApplicantId,
        setSelectedApplicantId,
        isAnnouncementPublished,
        togglePublishAnnouncement,
        updateApplicantStatus,
        setSelectionDecision,
        submitRegistration,
        globalSimState,
        setGlobalSimState,
        isBackendConnected,
        refreshBackendData,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
