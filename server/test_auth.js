const axios = require('axios');

const testAuth = async () => {
  try {
    console.log('Testing Signup...');
    const signupRes = await axios.post('http://localhost:5000/api/auth/signup', {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    });
    console.log('Signup Success:', signupRes.data);

    const token = signupRes.data.token;

    console.log('Testing Login...');
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: signupRes.data.user.email,
      password: 'password123'
    });
    console.log('Login Success:', loginRes.data);

  } catch (error) {
    console.error('Auth Test Failed:', error.response ? error.response.data : error.message);
  }
};

testAuth();
