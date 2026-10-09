async function testDeleteLeadAPI() {
  try {
    console.log('--- 1. ADMIN LOGIN ---');
    const loginRes = await fetch('https://sscomputer-api.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@sscomputer.in', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    console.log('Login result:', loginRes.status, loginData.success);

    let headers = { 'Content-Type': 'application/json' };
    if (loginData.token) {
      headers['Authorization'] = `Bearer ${loginData.token}`;
    }

    console.log('\n--- 2. CREATE QA LEAD ENQUIRY ---');
    const createRes = await fetch('https://sscomputer-api.onrender.com/api/leads', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: 'UGS QA TEST LEAD TO DELETE',
        phone: '9988776655',
        email: 'qadelete@ssci.com',
        courseInterested: 'Python',
        preferredBatch: 'Morning',
        message: 'QA Delete Test',
        source: 'Website'
      })
    });
    const createData = await createRes.json();
    console.log('Create result:', createRes.status, createData.lead?.id);

    if (createData.lead?.id) {
      console.log('\n--- 3. DELETE /api/leads/:id ---');
      const deleteRes = await fetch(`https://sscomputer-api.onrender.com/api/leads/${createData.lead.id}`, {
        method: 'DELETE',
        headers
      });
      console.log('Delete status:', deleteRes.status);
    }

  } catch (err) {
    console.error('Test error:', err);
  }
}

testDeleteLeadAPI();
