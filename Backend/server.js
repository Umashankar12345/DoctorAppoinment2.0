const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware'); // We'll create this or just define inline if simple

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:3000',
            process.env.FRONTEND_URL
        ].filter(Boolean);

        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/locations', require('./routes/locationRoutes'));
app.use('/api/clinics', require('./routes/clinicRoutes'));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Doctor Appointment API !' })
})

// Custom Error Handler (Simple version inline or we create checks)
app.use((err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    console.error('Error:', err.message); // Log error message
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

app.listen(port, () => {
    console.log(`\n🚀 Server is running on port ${port}`);
    console.log(`📝 Available endpoints:`);
    console.log(`   ✅ GET  - http://localhost:${port}/`);
    console.log(`   ✅ POST - http://localhost:${port}/api/auth/register`);
    console.log(`   ✅ POST - http://localhost:${port}/api/auth/login`);
    console.log(`   ✅ POST - http://localhost:${port}/api/appointments`);
    console.log(`   ✅ GET  - http://localhost:${port}/api/doctors/top`);
    console.log(`   ✅ GET  - http://localhost:${port}/api/doctors/stats`);
    console.log(`   ✅ GET  - http://localhost:${port}/api/doctors/search`);
    console.log(`   ✅ GET  - http://localhost:${port}/api/clinics`);
    console.log(`\n👂 Waiting for requests...\n`);
});
