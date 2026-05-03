const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// ================= REGISTER =================
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, specialization, experience, location, phone, state, district, taluka, village, fees, about, mciNumber } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please fill all required fields');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
        name,
        email,
        password: hashedPassword,
        role: role || 'patient'
    };

    if (role === 'doctor') {
        if (!specialization || experience === undefined || experience === null || !mciNumber) {
            res.status(400);
            throw new Error('Doctor must provide specialization, experience, and MCI number');
        }

        const mciExists = await User.findOne({ mciNumber });
        if (mciExists) {
            res.status(400);
            throw new Error('A doctor with this MCI registration number already exists');
        }

        userData.mciNumber = mciNumber;
        userData.specialization = specialization;
        userData.experience = Number(experience);
        userData.phone = phone || '';
        userData.state = state || '';
        userData.district = district || '';
        userData.taluka = taluka || '';
        userData.village = village || '';
        userData.fees = fees ? Number(fees) : 500;
        userData.about = about || '';
        userData.location = location || {
            type: 'Point',
            coordinates: [0, 0]
        };
    }

    const user = await User.create(userData);

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
    });
});

// ================= LOGIN =================
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please enter email and password');
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
    });
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

module.exports = {
    registerUser,
    loginUser
};
