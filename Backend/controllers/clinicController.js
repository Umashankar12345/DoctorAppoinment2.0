const asyncHandler = require('express-async-handler');
const Clinic = require('../models/clinicModel');

// @desc    Get clinics with filters
// @route   GET /api/clinics
// @access  Public
const getClinics = asyncHandler(async (req, res) => {
    const { state, district, type, name } = req.query;
    const query = {};

    if (state) query.state = state;
    if (district) query.district = district;
    if (type) query.type = type;
    if (name) query.name = { $regex: name, $options: 'i' };

    const clinics = await Clinic.find(query)
        .populate('doctors', 'name specialization experience rating image fees')
        .sort({ rating: -1 });

    res.json(clinics);
});

// @desc    Get single clinic by ID
// @route   GET /api/clinics/:id
// @access  Public
const getClinicById = asyncHandler(async (req, res) => {
    const clinic = await Clinic.findById(req.params.id)
        .populate('doctors', 'name specialization experience rating image fees phone qualifications languages consultationModes availableSlots');

    if (!clinic) {
        res.status(404);
        throw new Error('Clinic not found');
    }

    res.json(clinic);
});

// @desc    Get nearby clinics
// @route   GET /api/clinics/nearby
// @access  Public
const getNearbyClinics = asyncHandler(async (req, res) => {
    const { lat, lng, distance, type } = req.query;

    if (!lat || !lng) {
        res.status(400);
        throw new Error('Please provide latitude and longitude');
    }

    const query = {
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(lng), parseFloat(lat)],
                },
                $maxDistance: parseInt(distance) || 50000,
            },
        },
    };

    if (type) query.type = type;

    const clinics = await Clinic.find(query)
        .populate('doctors', 'name specialization experience rating image fees')
        .limit(20);

    res.json(clinics);
});

module.exports = {
    getClinics,
    getClinicById,
    getNearbyClinics,
};
