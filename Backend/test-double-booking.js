const axios = require('axios');

async function testDoubleBooking() {
    const baseUrl = 'http://localhost:5000/api/appointments';
    const token = 'YOUR_TOKEN_HERE'; // User needs to provide this or I use a mock if I had a test runner

    const appointmentData = {
        department: 'Cardiology',
        doctorName: 'Dr. Smith',
        doctorId: '60d...', // Valid doctor ID
        date: '2023-10-25',
        timeSlot: '10:00 AM'
    };

    try {
        console.log('Attempting first booking...');
        // const res1 = await axios.post(baseUrl, appointmentData, { headers: { Authorization: `Bearer ${token}` } });
        // console.log('First booking successful:', res1.status);

        console.log('Attempting second booking for the same slot...');
        // const res2 = await axios.post(baseUrl, appointmentData, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        console.log('Caught expected error:', error.response?.data?.message);
    }
}

console.log('This script is a template. Run it manually with a valid token to verify.');
