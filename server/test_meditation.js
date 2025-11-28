const axios = require('axios');

const testMeditation = async () => {
  try {
    console.log('Testing Meditation API...');
    const res = await axios.get('http://127.0.0.1:5000/api/meditations?score=8');
    console.log('Success! Found', res.data.length, 'meditations.');
    console.log('First item:', res.data[0].title);
  } catch (error) {
    console.error('Test Failed:', error.message);
  }
};

testMeditation();
