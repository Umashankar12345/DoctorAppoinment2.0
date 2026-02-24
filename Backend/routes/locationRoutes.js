const express = require('express');
const router = express.Router();
const { getAllStates, getDistrictsByState } = require('india-states-districts');
const User = require('../models/userModel');

// Get all states
router.get('/states', (req, res) => {
    try {
        const states = getAllStates().sort();
        res.json(states);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get districts for a state
router.get('/districts', (req, res) => {
    try {
        const { state } = req.query;
        if (!state) {
            return res.status(400).json({ message: 'Missing state' });
        }
        const districts = getDistrictsByState(state).sort();
        res.json(districts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get specializations for a state/district (from actual doctor data in DB)
router.get('/specializations', async (req, res) => {
    try {
        const { state, district } = req.query;
        const query = { role: 'doctor' };
        if (state) query.state = state;
        if (district) query.district = district;

        const specializations = await User.distinct('specialization', query);
        res.json(specializations.filter(Boolean).sort());
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
