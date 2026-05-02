const express = require('express');
const router = express.Router();
const { getNearbyDoctors, searchDoctors, getTopDoctors, getSpecializations, getDoctorById, getDoctorStats, addDoctorReview } = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');

router.get('/top', getTopDoctors);
router.get('/stats', getDoctorStats);
router.get('/specializations', getSpecializations);
router.get('/nearby', getNearbyDoctors);
router.get('/search', searchDoctors);
router.get('/:id', getDoctorById);
router.post('/:id/reviews', protect, addDoctorReview);

module.exports = router;
