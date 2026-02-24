const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { getAllStatesWithDistricts } = require('india-states-districts');
const { faker } = require('@faker-js/faker');
const User = require('../models/userModel');
const connectDB = require('../config/db');

dotenv.config();

const specializations = [
    'General Physician', 'Cardiologist', 'Dermatologist', 'Pediatrician',
    'Gynecologist', 'Neurologist', 'Orthopedic', 'Dentist', 'Psychiatrist', 'Eye Specialist'
];

const seedNationwide = async () => {
    try {
        await connectDB();

        // Clear existing doctors to avoid duplicates during seeding
        console.log('Clearing existing doctors...');
        await User.deleteMany({ role: 'doctor' });

        const allData = getAllStatesWithDistricts();
        let doctors = [];

        console.log('Generating doctor data...');
        allData.forEach((stateObj) => {
            stateObj.districts.forEach((dist) => {
                // Create 3 doctors for every single district in India (keeping it slightly smaller than 5 for performance)
                for (let i = 0; i < 3; i++) {
                    const name = faker.person.fullName();
                    const stateSafe = stateObj.name;
                    const distSafe = dist;

                    doctors.push({
                        name: `Dr. ${name}`,
                        email: faker.internet.email().toLowerCase(),
                        password: 'password123', // Default password
                        role: 'doctor',
                        specialization: faker.helpers.arrayElement(specializations),
                        experience: faker.number.int({ min: 2, max: 30 }),
                        fees: faker.number.int({ min: 300, max: 2000, step: 100 }),
                        phone: faker.phone.number({ style: 'national' }),
                        rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
                        about: `Expert healthcare provider in ${distSafe}, ${stateSafe}. Dedicated to patient care with ${faker.number.int({ min: 2, max: 30 })} years of experience.`,
                        state: stateSafe,
                        district: distSafe,
                        area: faker.location.secondaryAddress(),
                        pincode: faker.location.zipCode('######'),
                        location: {
                            state: stateSafe,
                            district: distSafe,
                            area: faker.location.secondaryAddress(),
                            pincode: faker.location.zipCode('######')
                        },
                        geoPoint: {
                            type: 'Point',
                            coordinates: [
                                parseFloat(faker.location.longitude({ min: 68, max: 97 })), // India longitude range
                                parseFloat(faker.location.latitude({ min: 8, max: 37 }))    // India latitude range
                            ]
                        }
                    });
                }
            });
        });

        console.log(`Inserting ${doctors.length} doctors...`);

        // Insert in chunks to avoid memory issues
        const chunkSize = 500;
        for (let i = 0; i < doctors.length; i += chunkSize) {
            const chunk = doctors.slice(i, i + chunkSize);
            await User.insertMany(chunk);
            console.log(`Progress: ${i + chunk.length}/${doctors.length}`);
        }

        console.log('✅ Seeded nationwide successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding:', error);
        process.exit(1);
    }
};

seedNationwide();
