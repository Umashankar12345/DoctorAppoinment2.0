const express = require('express');
const router = express.Router();
const { getNearbyDoctors, searchDoctors, getTopDoctors, getSpecializations, getDoctorById, getDoctorStats } = require('../controllers/doctorController');

router.get('/top', getTopDoctors);
router.get('/stats', getDoctorStats);
router.get('/specializations', getSpecializations);
router.get('/nearby', getNearbyDoctors);
router.get('/search', searchDoctors);
router.get('/:id', getDoctorById);

module.exports = router;
