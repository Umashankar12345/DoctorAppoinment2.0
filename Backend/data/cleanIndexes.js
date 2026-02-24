const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

dotenv.config();

const cleanIndexes = async () => {
    try {
        await connectDB();
        const db = mongoose.connection.db;
        const collection = db.collection('users');

        console.log('Fetching indexes...');
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes.map(i => i.name));

        const legacyIndex = indexes.find(i => i.name === 'location_2dsphere' || (i.key && i.key.location === '2dsphere'));

        if (legacyIndex) {
            console.log(`Dropping legacy index: ${legacyIndex.name}`);
            await collection.dropIndex(legacyIndex.name);
            console.log('✅ Legacy index dropped.');
        } else {
            console.log('No legacy 2dsphere index found on "location" field.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

cleanIndexes();
