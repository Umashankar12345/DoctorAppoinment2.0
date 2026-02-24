const axios = require('axios');

const testRegister = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            name: "Test Patient",
            email: "testpatient" + Math.floor(Math.random() * 1000) + "@example.com",
            password: "password123",
            role: "patient"
        });
        console.log('Registration Success:', response.data);
    } catch (error) {
        if (error.response) {
            console.log('Registration Failed:', error.response.status, error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    }
};

testRegister();
