const express = require('express');
const router = express.Router();
const {
    bookAppointment,
    getAppointments,
    updateAppointmentStatus,
    getPatientDashboard,
    getDoctorDashboard,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, bookAppointment).get(protect, getAppointments);
router.route('/patient-dashboard').get(protect, getPatientDashboard);
router.route('/doctor-dashboard').get(protect, getDoctorDashboard);
router.route('/:id').put(protect, updateAppointmentStatus);

module.exports = router;
