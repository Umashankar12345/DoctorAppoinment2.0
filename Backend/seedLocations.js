const mongoose = require('mongoose');
const User = require('./models/userModel');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedLocations = async () => {
    await connectDB();

    try {
        // Ensure index exists
        await User.collection.createIndex({ location: "2dsphere" });
        console.log("Geospatial index ensured.");

        // Update Doctor 1 (Bangalore Center)
        const doc1 = await User.findOne({ email: 'doctor@example.com' });
        if (doc1) {
            doc1.location = {
                type: 'Point',
                coordinates: [77.5946, 12.9716] // Bangalore
            };
            doc1.state = "Karnataka";
            doc1.district = "Bangalore Urban";
            await doc1.save();
            console.log('Updated doctor@example.com location');
        }

        // Create a new dummy doctor if not exists
        const exists = await User.findOne({ email: 'testdoc@example.com' });
        if (!exists) {
            await User.create({
                name: 'Dr. Test Geo',
                email: 'testdoc@example.com',
                password: 'password123',
                role: 'doctor',
                specialization: 'Cardiologist',
                experience: 10,
                location: {
                    type: 'Point',
                    coordinates: [77.6, 12.98] // Nearby Bangalore
                },
                state: "Karnataka",
                district: "Bangalore Urban",
                availableSlots: []
            });
            console.log('Created testdoc@example.com');
        }

        console.log('Seeding completed');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedLocations();
