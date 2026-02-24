const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Search doctors with filters (state, district, specialization, name, language, mode, rating, fees, sort)
// @route   GET /api/doctors/search
// @access  Public
const searchDoctors = async (req, res) => {
    try {
        const {
            state,
            district,
            specialization,
            name,
            language,
            consultationMode,
            minRating,
            maxFees,
            sortBy,
            page = 1,
            limit = 10
        } = req.query;

        const query = { role: 'doctor' };

        // Support both old and new location structures
        if (state) {
            query.$or = [
                { state: state },
                { "location.state": state }
            ];
        }
        if (district) {
            if (query.$or) {
                // If state was provided, we need to ensure district is within that state match
                // However, the seeder sets both. For search efficiency, we'll just check district.
                query.district = district;
            } else {
                query.$or = [
                    { district: district },
                    { "location.district": district }
                ];
            }
        }

        if (specialization) query.specialization = { $regex: specialization, $options: 'i' };
        if (name) query.name = { $regex: name, $options: 'i' };
        if (language) query.languages = { $in: [language] };
        if (consultationMode) query.consultationModes = { $in: [consultationMode] };
        if (minRating) query.rating = { $gte: parseFloat(minRating) };
        if (maxFees) query.fees = { $lte: parseInt(maxFees) };

        let sortOption = { rating: -1 };
        if (sortBy === 'fees-low') sortOption = { fees: 1 };
        else if (sortBy === 'fees-high') sortOption = { fees: -1 };
        else if (sortBy === 'experience') sortOption = { experience: -1 };
        else if (sortBy === 'name') sortOption = { name: 1 };

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const doctors = await User.find(query)
            .select('-password')
            .populate('clinic', 'name address type timings')
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await User.countDocuments(query);

        res.json({
            doctors,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get top doctors (highest rated)
// @route   GET /api/doctors/top
// @access  Public
const getTopDoctors = async (req, res) => {
    try {
        const { limit = 20 } = req.query;
        const doctors = await User.find({ role: 'doctor' })
            .select('-password')
            .populate('clinic', 'name address type')
            .sort({ rating: -1, experience: -1 })
            .limit(parseInt(limit));
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get distinct specializations (optionally filtered by state/district)
// @route   GET /api/doctors/specializations
// @access  Public
const getSpecializations = async (req, res) => {
    try {
        const { state, district } = req.query;
        const query = { role: 'doctor' };
        if (state) query.state = state;
        if (district) query.district = district;

        const specializations = await User.distinct('specialization', query);
        res.json(specializations.filter(Boolean).sort());
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get nearby doctors
// @route   GET /api/doctors/nearby
// @access  Public
const getNearbyDoctors = asyncHandler(async (req, res) => {
    const { lat, lng, distance, specialization, minExp } = req.query;

    if (!lat || !lng) {
        res.status(400);
        throw new Error('Please provide latitude and longitude');
    }

    const query = {
        role: 'doctor',
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [parseFloat(lng), parseFloat(lat)]
                },
                $maxDistance: parseInt(distance) || 10000
            }
        }
    };

    if (specialization) query.specialization = specialization;
    if (minExp) query.experience = { $gte: parseInt(minExp) };

    const doctors = await User.find(query)
        .select('-password')
        .populate('clinic', 'name address type');

    res.json(doctors);
});

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = asyncHandler(async (req, res) => {
    const doctor = await User.findById(req.params.id)
        .select('-password')
        .populate('clinic', 'name address type timings phone facilities image');

    if (!doctor || doctor.role !== 'doctor') {
        res.status(404);
        throw new Error('Doctor not found');
    }

    res.json(doctor);
});

// @desc    Get doctor stats (aggregates)
// @route   GET /api/doctors/stats
// @access  Public
const getDoctorStats = asyncHandler(async (req, res) => {
    const totalDoctors = await User.countDocuments({ role: 'doctor' });

    const bySpecialization = await User.aggregate([
        { $match: { role: 'doctor' } },
        { $group: { _id: '$specialization', count: { $sum: 1 }, avgRating: { $avg: '$rating' }, avgFees: { $avg: '$fees' } } },
        { $sort: { count: -1 } },
    ]);

    const byState = await User.aggregate([
        { $match: { role: 'doctor' } },
        { $group: { _id: '$state', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]);

    const topRated = await User.find({ role: 'doctor' })
        .select('name specialization rating state district image')
        .sort({ rating: -1 })
        .limit(5);

    res.json({
        totalDoctors,
        bySpecialization,
        byState,
        topRated,
    });
});

module.exports = {
    searchDoctors,
    getTopDoctors,
    getSpecializations,
    getNearbyDoctors,
    getDoctorById,
    getDoctorStats,
};
