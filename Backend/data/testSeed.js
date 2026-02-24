const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const connectDB = require('../config/db');

dotenv.config();

const testSeed = async () => {
    try {
        await connectDB();
        console.log('Connected. Attempting to seed 1 doctor...');

        const doc = {
            name: 'Dr. Test Diagnostic',
            email: 'test' + Math.random() + '@example.com',
            password: 'password123',
            role: 'doctor',
            specialization: 'General Physician',
            experience: 5,
            phone: '1234567890',
            state: 'Bihar',
            district: 'Patna',
            location: {
                state: 'Bihar',
                district: 'Patna'
            }
        };

        const newDoc = new User(doc);
        await newDoc.save();
        console.log('✅ Success! Single doctor seeded.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed:', error);
        process.exit(1);
    }
};

testSeed();
