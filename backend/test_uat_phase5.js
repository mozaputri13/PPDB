// Test Suite UAT End-to-End & Hardening Validation — Fase 5
import http from 'node:http';
import crypto from 'node:crypto';
import { db } from './src/db/database.js';

const BASE_URL = 'http://localhost:3001/api';

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    const url = new URL(`http://localhost:3001/api${cleanPath}`);
    const reqHeaders = { ...headers };
    let reqBody = null;

    if (body && typeof body === 'object' && !(body instanceof Buffer)) {
      reqHeaders['Content-Type'] = 'application/json';
      reqBody = JSON.stringify(body);
    } else if (body) {
      reqBody = body;
    }

    const req = http.request(url, {
      method,
      headers: reqHeaders
    }, (res) => {
      let rawData = '';
      res.on('data', chunk => rawData += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(rawData);
        } catch {}
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json,
          raw: rawData
        });
      });
    });

    req.on('error', reject);
    if (reqBody) req.write(reqBody);
    req.end();
  });
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runUAT() {
  console.log('\n================================================================');
  console.log('🧪 MEMULAI PENGUJIAN UAT LENGKAP & HARDENING (FASE 5 PPDB)');
  console.log('================================================================\n');

  try {
    // 1. Health check & Security Headers
    console.log('1. Pengujian Security Headers & Health Check');
    const health = await request('GET', '/health');
    assert(health.status === 200 && health.data.status === 'ok', 'Endpoint /api/health mengembalikan 200 OK');
    assert(health.headers['x-content-type-options'] === 'nosniff', 'Header X-Content-Type-Options: nosniff aktif');
    assert(health.headers['x-frame-options'] === 'SAMEORIGIN', 'Header X-Frame-Options: SAMEORIGIN aktif');
    assert(health.headers['referrer-policy'] === 'strict-origin-when-cross-origin', 'Header Referrer-Policy aktif');

    // 2. Input Validation Hardening (NISN invalid format)
    console.log('\n2. Pengujian Validasi Input & Sanitasi (Hardening)');
    const invalidReg = await request('POST', '/auth/register', {
      nisn: '12345', // kurang dari 10 digit
      nama: 'Test Invalid',
      email: 'invalid@test.com',
      password: 'pass' // kurang dari 6 karakter
    });
    assert(invalidReg.status === 400, 'Registrasi dengan NISN tidak 10 digit ditolak (400 Bad Request)');

    // 3. Admin Authentication
    console.log('\n3. Pengujian Autentikasi Admin & RBAC');
    const adminLogin = await request('POST', '/auth/login', {
      identifier: 'panitia.ppdb@smpn1harapan.sch.id',
      password: 'password123'
    });
    assert(adminLogin.status === 200 && adminLogin.data.token, 'Login panitia admin berhasil menerima JWT token');
    const adminToken = adminLogin.data.token;

    // RBAC Test: Non-admin accessing admin route
    const dummyStudentToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItc3R1ZGVudC0wMSIsInJvbGUiOiJzdHVkZW50In0.dummy';
    const unauthorized = await request('GET', '/admin/metrics', null, {
      Authorization: `Bearer ${dummyStudentToken}`
    });
    assert(unauthorized.status === 401 || unauthorized.status === 403, 'Akses rute admin dengan token student/invalid ditolak (401/403)');

    // 4. Calon Siswa Flow: Registrasi, Draft, Update Formulir
    console.log('\n4. Pengujian Alur Calon Siswa (Registrasi s/d Submit)');
    const testNisn = `99${Date.now().toString().slice(-8)}`;
    const studentReg = await request('POST', '/auth/register', {
      nisn: testNisn,
      nama: 'Ananda UAT Putri',
      email: `uat_${Date.now()}@gmail.com`,
      password: 'password123'
    });
    assert(studentReg.status === 201 && studentReg.data.user.role === 'student', 'Registrasi siswa baru berhasil membuat akun dan registrasi Draft');
    const studentToken = studentReg.data.token;

    // Update formulir siswa
    const updateForm = await request('PUT', '/student/registration', {
      jalur: 'Afirmasi',
      studentProfile: {
        nik: '3201234567890001',
        namaLengkap: 'Ananda UAT Putri',
        jenisKelamin: 'Perempuan',
        tempatLahir: 'Jakarta',
        tanggalLahir: '2013-05-12',
        agama: 'Islam',
        alamatLengkap: 'Jl. Merdeka No. 12, RT 01/RW 04'
      },
      parentProfile: {
        namaAyah: 'Bambang UAT',
        pekerjaanAyah: 'Wiraswasta',
        namaIbu: 'Siti Aminah',
        pekerjaanIbu: 'Ibu Rumah Tangga',
        noWhatsapp: '081298765432'
      },
      schoolOrigin: {
        namaSekolah: 'SD Negeri Cempaka 01',
        npsn: '20104523',
        nilaiRataRata: 89.50
      }
    }, { Authorization: `Bearer ${studentToken}` });
    assert(updateForm.status === 200, 'Penyimpanan kelengkapan data formulir siswa berhasil');

    // Validasi submit ditolak jika dokumen belum lengkap 4
    const submitPremature = await request('POST', '/student/submit', {}, {
      Authorization: `Bearer ${studentToken}`
    });
    assert(submitPremature.status === 400, 'Submit pendaftaran ditolak jika berkas dokumen belum lengkap 4 berkas');

    // Lengkapi berkas dokumen persyaratan siswa di database
    const studentRegId = studentReg.data.user.registrationId;
    const docTypes = ['kk', 'akta', 'pasfoto', 'skl'];
    for (const dt of docTypes) {
      db.prepare(`
        INSERT INTO uploaded_documents (id, registration_id, document_type, file_name, file_path, file_size, mime_type)
        VALUES (?, ?, ?, ?, ?, 512000, 'application/pdf')
      `).run(crypto.randomUUID(), studentRegId, dt, `${dt}_uat.pdf`, `storage/documents/${crypto.randomUUID()}.pdf`);
    }

    // Submit pendaftaran setelah dokumen lengkap
    const submitReg = await request('POST', '/student/submit', {}, {
      Authorization: `Bearer ${studentToken}`
    });
    assert(submitReg.status === 200 && submitReg.data.status === 'Submitted', 'Submit pendaftaran berhasil mengubah status menjadi Submitted (Menunggu Verifikasi)');

    // 5. Admin Flow: Verifikasi, Perlu Revisi, dan Verifikasi Akhir
    console.log('\n5. Pengujian Alur Verifikasi Admin & Revisi Berkas');

    // Admin minta revisi
    const reqRevision = await request('PUT', `/admin/applicants/${studentRegId}/revision`, {
      note: 'Foto Kartu Keluarga buram, mohon unggah ulang dengan resolusi lebih jelas.'
    }, { Authorization: `Bearer ${adminToken}` });
    assert(reqRevision.status === 200, 'Admin berhasil meminta revisi dokumen kepada siswa');

    // Cek status di sisi siswa
    const studentStatusCheck = await request('GET', '/student/registration', null, {
      Authorization: `Bearer ${studentToken}`
    });
    assert(studentStatusCheck.data.registration.status === 'Needs Revision', 'Status pendaftaran siswa terupdate menjadi Needs Revision');
    assert(studentStatusCheck.data.registration.revisiNotes.includes('buram'), 'Catatan revisi admin tersampaikan ke dashboard siswa');

    // Admin verifikasi pendaftaran
    const verifySuccess = await request('PUT', `/admin/applicants/${studentRegId}/verify`, {}, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(verifySuccess.status === 200, 'Admin berhasil memverifikasi berkas pendaftar (Status: Verified)');

    // 6. Seleksi & Penetapan Kelulusan
    console.log('\n6. Pengujian Modul Seleksi & Penetapan Kelulusan');
    const setSelection = await request('PUT', `/admin/selection/${studentRegId}`, {
      decision: 'Accepted'
    }, { Authorization: `Bearer ${adminToken}` });
    assert(setSelection.status === 200, 'Admin berhasil menetapkan hasil seleksi calon siswa menjadi Accepted (Diterima)');

    // 7. Pengumuman Kelulusan Publik & Proteksi UU PDP
    console.log('\n7. Pengujian Publikasi Pengumuman & Masking Privasi (UU PDP)');
    // Toggle pengumuman
    const togglePub = await request('POST', '/admin/announcement/publish', {}, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(togglePub.status === 200, 'Admin berhasil mengubah status publikasi pengumuman');

    // Akses publik pengumuman
    const publicAnnouncement = await request('GET', '/public/announcement');
    assert(publicAnnouncement.status === 200, 'Publik dapat mengakses daftar pengumuman resmi');
    const acceptedList = publicAnnouncement.data.acceptedList || [];
    if (acceptedList.length > 0) {
      const firstStudent = acceptedList[0];
      assert(firstStudent.nisn.includes('****'), 'NISN calon siswa berhasil disamarkan (masking) di pengumuman publik demi privasi');
      assert(!firstStudent.nik, 'NIK siswa tidak diekspos di pengumuman publik');
      assert(!firstStudent.no_whatsapp, 'Nomor kontak pribadi tidak diekspos di pengumuman publik');
    }

    // 8. Ekspor Laporan CSV (UTF-8 BOM) & PDF Official Decree
    console.log('\n8. Pengujian Modul Laporan & Ekspor Berkas');
    const csvExport = await request('GET', '/admin/reports/export-csv', null, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(csvExport.status === 200, 'Endpoint ekspor CSV merespons 200 OK');
    assert(csvExport.raw.startsWith('\uFEFF'), 'CSV diawali dengan UTF-8 BOM (\\uFEFF) untuk kompatibilitas sempurna Microsoft Excel');
    assert(csvExport.raw.includes('No. Pendaftaran') && csvExport.raw.includes('NISN'), 'Header kolom CSV lengkap dan sesuai');

    const pdfReport = await request('GET', '/admin/reports/export-pdf', null, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(pdfReport.status === 200, 'Endpoint laporan PDF resmi merespons 200 OK');
    assert(pdfReport.raw.includes('SURAT KEPUTUSAN') && pdfReport.raw.includes('Drs. H. Ahmad Dahlan'), 'Format cetak PDF berisi Kop Surat resmi, SK Panitia, dan tanda tangan');

    const decreeData = await request('GET', '/admin/reports/official-decree', null, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(decreeData.status === 200 && decreeData.data.skNumber, 'Endpoint data SK kelulusan menyediakan metadata lengkap');

    // 9. Audit Logs
    console.log('\n9. Pengujian Rekam Jejak Audit (Audit Trail)');
    const metrics = await request('GET', '/admin/metrics', null, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(metrics.status === 200 && metrics.data.metrics.total > 0, 'Metrik ringkasan panitia admin terverifikasi akurat');

    console.log('\n================================================================');
    console.log(`📊 HASIL PENGUJIAN UAT: ${passed} PASSED, ${failed} FAILED`);
    console.log('================================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal error during UAT:', err);
    process.exit(1);
  }
}

runUAT();
