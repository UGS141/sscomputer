async function testCORSOrigins() {
  const origins = [
    'https://sscomputer.vercel.app',
    'https://sscomputer-git-main-ugs141s-projects.vercel.app',
    'https://sscomputerinstitute.com',
    'https://www.sscomputerinstitute.com',
    'http://localhost:5173',
    'https://random-domain.com'
  ];

  for (const origin of origins) {
    console.log(`\n--- Testing Origin: ${origin} ---`);
    try {
      const res = await fetch('https://sscomputer-api.onrender.com/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': origin
        },
        body: JSON.stringify({ name: 'CORS Test', phone: '9876543210' })
      });
      console.log('Status:', res.status, res.statusText);
      console.log('Allow-Origin:', res.headers.get('access-control-allow-origin'));
      console.log('Body:', await res.text());
    } catch (err) {
      console.error('Fetch error:', err.message);
    }
  }
}

testCORSOrigins();
