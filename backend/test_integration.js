// Test Skrip Integrasi End-to-End Alur PPDB (Fase 4)
import fs from 'node:fs';

const BASE_URL = 'http://localhost:3001/api';

async function runTests() {
  console.log('--- MEMULAI INTEGRATION TEST SUITE PPDB SOT (FASE 4) ---\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Public Info
    const infoRes = await fetch(`${BASE_URL}/public/info`);
    const infoData = await infoRes.json();
    assert(infoRes.ok && infoData.school.quota.total === 216, 'Endpoint publik info menampilkan kuota daya tampung 216');

    // 2. Student Registration
    const testNisn = `009${Math.floor(1000000 + Math.random() * 9000000)}`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nisn: testNisn,
        nama: 'Ananda Putri Khairunnisa',
        email: `ananda.${testNisn}@test.com`,
        password: 'password123'
      })
    });
    const regData = await regRes.json();
    assert(regRes.status === 201 && regData.token, `Registrasi calon siswa baru berhasil (NISN: ${testNisn})`);
    const studentToken = regData.token;
    const studentRegId = regData.user.registrationId;

    // 3. Student Form Update
    const updateRes = await fetch(`${BASE_URL}/student/registration`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        jalur: 'Prestasi',
        nik: '3201123456789999',
        nama: 'Ananda Putri Khairunnisa',
        tempatLahir: 'Jakarta',
        tanggalLahir: '2013-07-21',
        jenisKelamin: 'Perempuan',
        agama: 'Islam',
        alamat: 'Jl. Melati Raya No. 10',
        namaAyah: 'Bambang Irawan',
        pekerjaanAyah: 'Wiraswasta',
        namaIbu: 'Dewi Lestari',
        pekerjaanIbu: 'Guru',
        whatsappOrtu: '081299887766',
        sekolahAsal: 'SDN 05 Harapan',
        npsnAsal: '60109999',
        tahunLulus: '2026',
        nilaiRataRata: '92.80'
      })
    });
    const updateData = await updateRes.json();
    assert(updateRes.ok, 'Calon siswa berhasil menyimpan biodata formulir 5 langkah');

    // 4. Student Document Upload (Multer)
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    for (const docType of ['kk', 'akta', 'pasfoto', 'skl']) {
      const formData = new FormData();
      const fakeBlob = new Blob(['%PDF-1.4 mock content'], { type: 'application/pdf' });
      formData.append('documentType', docType);
      formData.append('file', fakeBlob, `${docType.toUpperCase()}_Ananda.pdf`);

      const uploadRes = await fetch(`${BASE_URL}/student/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${studentToken}` },
        body: formData
      });
      assert(uploadRes.ok, `Unggah berkas ${docType.toUpperCase()} berhasil`);
    }

    // 5. Student Final Submit
    const submitRes = await fetch(`${BASE_URL}/student/submit`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    const submitData = await submitRes.json();
    assert(submitRes.ok && submitData.status === 'Submitted', 'Pendaftaran berhasil dikirim final (Status: Submitted)');

    // 6. Admin Login
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'panitia.ppdb@smpn1harapan.sch.id',
        password: 'password123'
      })
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.ok && adminLoginData.user.role === 'admin', 'Login panitia admin berhasil (Role: admin)');
    const adminToken = adminLoginData.token;

    // 7. Admin Metrics
    const metricsRes = await fetch(`${BASE_URL}/admin/metrics`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const metricsData = await metricsRes.json();
    assert(metricsRes.ok && metricsData.metrics.total >= 7, 'Admin metrics berhasil menghitung total pendaftar di database');

    // 8. Admin Request Revision
    const revRes = await fetch(`${BASE_URL}/admin/applicants/${studentRegId}/revision`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ note: 'Foto Akta Kelahiran agak miring, mohon unggah ulang.' })
    });
    const revData = await revRes.json();
    assert(revRes.ok && revData.status === 'Needs Revision', 'Panitia berhasil mengirim instruksi perbaikan berkas (Status: Needs Revision)');

    // 9. Student checks dashboard after revision
    const studentCheckRes = await fetch(`${BASE_URL}/student/registration`, {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    const studentCheckData = await studentCheckRes.json();
    assert(studentCheckData.registration.status === 'Needs Revision' && studentCheckData.registration.revisiNotes.includes('Akta'), 'Dashboard siswa menampilkan status Needs Revision dan catatan verifikator');

    // 10. Admin Verifies Applicant
    const verifyRes = await fetch(`${BASE_URL}/admin/applicants/${studentRegId}/verify`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const verifyData = await verifyRes.json();
    assert(verifyRes.ok && verifyData.status === 'Verified', 'Panitia menyetujui verifikasi berkas (Status: Verified)');

    // 11. Admin Decision Accepted
    const decisionRes = await fetch(`${BASE_URL}/admin/selection/${studentRegId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ decision: 'Accepted' })
    });
    const decisionData = await decisionRes.json();
    assert(decisionRes.ok && decisionData.status === 'Accepted', 'Penetapan seleksi kelulusan berhasil (Status: Accepted)');

    // 12. Admin Publishes Announcement
    const pubRes = await fetch(`${BASE_URL}/admin/announcement/publish`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const pubData = await pubRes.json();
    assert(pubRes.ok && pubData.isAnnouncementPublished === true, 'Admin berhasil menerbitkan pengumuman kelulusan resmi');

    // 13. Public Announcement Masking Check
    const pubCheckRes = await fetch(`${BASE_URL}/public/announcement`);
    const pubCheckData = await pubCheckRes.json();
    assert(pubCheckRes.ok && pubCheckData.isPublished === true, 'Pengumuman publik aktif setelah diterbitkan admin');
    const studentInList = pubCheckData.applicants.find(a => a.no_pendaftaran === studentRegId);
    assert(studentInList && studentInList.nisn_masked.includes('****'), 'Data siswa tercantum di pengumuman publik dengan NIK/NISN termasking (UU PDP)');

    // 14. RBAC Security Check: Student cannot access Admin Endpoints
    const rbacRes = await fetch(`${BASE_URL}/admin/metrics`, {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    assert(rbacRes.status === 403, 'Proteksi RBAC: Calon siswa diblokir dari endpoint admin (HTTP 403 Forbidden)');

    console.log(`\n--- HASIL INTEGRATION TEST: ${passed} PASSED, ${failed} FAILED ---`);
  } catch (err) {
    console.error('Error during test execution:', err);
  }
}

runTests();
