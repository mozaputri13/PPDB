// Service API Client untuk integrasi Front-End dengan Backend Express + SQLite
const API_BASE = '/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('ppdb_token');
  const headers = {
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}: Gagal memproses permintaan.`);
  }

  return data;
}

export const api = {
  // Auth
  login: (identifier, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password })
    }),

  register: (nisn, nama, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nisn, nama, email, password })
    }),

  getMe: () => request('/auth/me'),

  // Calon Siswa
  getStudentRegistration: () => request('/student/registration'),

  saveStudentRegistration: (formData) =>
    request('/student/registration', {
      method: 'PUT',
      body: JSON.stringify(formData)
    }),

  submitRegistration: () =>
    request('/student/submit', {
      method: 'POST'
    }),

  uploadDocument: (documentType, file) => {
    const formData = new FormData();
    formData.append('documentType', documentType);
    formData.append('file', file);
    return request('/student/upload', {
      method: 'POST',
      body: formData
    });
  },

  // Admin / Panitia
  getAdminMetrics: () => request('/admin/metrics'),

  getAdminApplicants: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admin/applicants?${q}`);
  },

  getAdminApplicantDetail: (id) => request(`/admin/applicants/${id}`),

  verifyApplicant: (id) =>
    request(`/admin/applicants/${id}/verify`, {
      method: 'PUT'
    }),

  requestRevision: (id, note) =>
    request(`/admin/applicants/${id}/revision`, {
      method: 'PUT',
      body: JSON.stringify({ note })
    }),

  rejectApplicant: (id) =>
    request(`/admin/applicants/${id}/reject`, {
      method: 'PUT'
    }),

  setSelectionDecision: (id, decision) =>
    request(`/admin/selection/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ decision })
    }),

  togglePublishAnnouncement: () =>
    request('/admin/announcement/publish', {
      method: 'POST'
    }),

  getReportsSummary: () => request('/admin/reports/summary'),
  getOfficialDecree: () => request('/admin/reports/official-decree'),

  downloadExportCsv: async () => {
    const token = localStorage.getItem('ppdb_token');
    const res = await fetch('/api/admin/reports/export-csv', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error('Gagal mengunduh rekapitulasi data pendaftar.');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Rekap_Pendaftar_PPDB_2026.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  openPdfReport: () => {
    const token = localStorage.getItem('ppdb_token');
    window.open(`/api/admin/reports/export-pdf?token=${encodeURIComponent(token || '')}`, '_blank');
  },

  // Public
  getPublicInfo: () => request('/public/info'),
  getPublicAnnouncement: () => request('/public/announcement')
};
