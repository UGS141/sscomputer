async function testRemoteStudentAPI() {
  try {
    console.log('--- 1. ADMIN LOGIN ---');
    const loginRes = await fetch('https://sscomputer-api.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD })
    });
    const loginData = await loginRes.json();
    console.log('Login status:', loginRes.status, 'Success:', loginData.success);

    let headers = { 'Content-Type': 'application/json' };
    if (loginData.token) {
      headers['Authorization'] = `Bearer ${loginData.token}`;
      console.log('Obtained valid JWT token.');
    }

    console.log('\n--- 2. GET /api/students ---');
    const getRes = await fetch('https://sscomputer-api.onrender.com/api/students', { headers });
    const getData = await getRes.json();
    console.log('Fetched students count:', getData.students?.length);

    console.log('\n--- 3. POST /api/students (CREATE) ---');
    const testId = `STD-QA-${Date.now().toString().slice(-4)}`;
    const testStudentId = `SSCI-STD-2026-QA-${Date.now().toString().slice(-4)}`;
    const createRes = await fetch('https://sscomputer-api.onrender.com/api/students', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        id: testId,
        studentId: testStudentId,
        name: 'UGS QA TEST STUDENT DELETE ME',
        phone: '+91 9998887770',
        email: 'qastudent@ssci.com',
        course: 'Python Programming',
        batch: 'Morning Batch',
        admissionDate: 'October 10, 2026',
        status: 'Active'
      })
    });
    const createData = await createRes.json();
    console.log('Create Result:', createData.success, 'Student ID:', createData.student?.studentId);

    console.log('\n--- 4. POST /api/students (UPDATE UPSERT) ---');
    const updateRes = await fetch('https://sscomputer-api.onrender.com/api/students', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        id: testId,
        studentId: testStudentId,
        name: 'UGS QA TEST STUDENT EDITED',
        phone: '+91 9998887770',
        email: 'qastudent@ssci.com',
        course: 'Python Programming',
        batch: 'Morning Batch',
        admissionDate: 'October 10, 2026',
        status: 'Completed',
        grade: 'A+'
      })
    });
    const updateData = await updateRes.json();
    console.log('Update Result:', updateData.success, 'Name:', updateData.student?.name, 'Status:', updateData.student?.status);

    console.log('\n--- 5. GET /api/students (VERIFY PERSISTENCE) ---');
    const getRes2 = await fetch('https://sscomputer-api.onrender.com/api/students', { headers });
    const getData2 = await getRes2.json();
    console.log('Persisted student list count:', getData2.students?.length);
    console.log('Student details in DB:', getData2.students?.[0]?.name, getData2.students?.[0]?.status);

  } catch (err) {
    console.error('Remote Student API Test error:', err);
  }
}

testRemoteStudentAPI();
