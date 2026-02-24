const asyncHandler = require('express-async-handler');
const Appointment = require('../models/appointmentModel');

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (Patient)
const bookAppointment = asyncHandler(async (req, res) => {
    const { department, doctorName, date, timeSlot, doctorId, doctorPhone } = req.body;

    if (!department || !doctorName || !date || !timeSlot) {
        res.status(400);
        throw new Error('Please fill all fields');
    }

    // Check for double-booking
    if (doctorId) {
        const existingAppointment = await Appointment.findOne({
            doctor: doctorId,
            date,
            timeSlot,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (existingAppointment) {
            res.status(400);
            throw new Error('This time slot is already booked for this doctor');
        }
    }

    const appointment = await Appointment.create({
        department,
        doctorName,
        doctor: doctorId || undefined,
        doctorPhone: doctorPhone || '',
        patientName: req.user.name,
        date,
        timeSlot,
        user: req.user.id,
    });

    res.status(201).json(appointment);
});

// @desc    Get appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = asyncHandler(async (req, res) => {
    let appointments;

    if (req.user.role === 'patient') {
        appointments = await Appointment.find({ user: req.user.id });
    } else if (req.user.role === 'doctor') {
        // Assuming doctor sees appointments where doctorName matches their name
        // Or all appointments for simplicity if logic isn't strictly defined assignment-wise
        // For now, let's filter by doctorName matching user name
        appointments = await Appointment.find({ doctorName: req.user.name });
    } else {
        res.status(401);
        throw new Error('Not authorized');
    }

    res.status(200).json(appointments);
});

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private (Doctor)
const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found');
    }

    // Check if user is doctor
    if (req.user.role !== 'doctor') {
        res.status(401);
        throw new Error('User not authorized');
    }

    // Ensure the appointment is assigned to this doctor (optional but good security)
    if (appointment.doctorName !== req.user.name) {
        res.status(401);
        throw new Error('Not authorized to update this appointment');
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        req.body, // Expecting { status: 'confirmed' | 'cancelled' | 'completed' }
        { new: true }
    );

    res.status(200).json(updatedAppointment);
});

// @desc    Get Patient Dashboard (Upcoming & History)
// @route   GET /api/appointments/patient-dashboard
// @access  Private (Patient)
const getPatientDashboard = asyncHandler(async (req, res) => {
    const upcoming = await Appointment.find({
        user: req.user.id,
        status: { $in: ['pending', 'confirmed'] }
    }).sort({ date: 1, timeSlot: 1 });

    const history = await Appointment.find({
        user: req.user.id,
        status: { $in: ['completed', 'cancelled'] }
    }).sort({ date: -1 });

    res.status(200).json({ upcoming, history });
});

// @desc    Get Doctor Dashboard (Daily Schedule & Pending)
// @route   GET /api/appointments/doctor-dashboard
// @access  Private (Doctor)
const getDoctorDashboard = asyncHandler(async (req, res) => {
    // For simplicity, we match by doctor name. Ideally by doctor ID if provided.
    // Note: The date format in the DB must match (e.g., YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];

    const schedule = await Appointment.find({
        doctorName: req.user.name,
        date: today,
        status: 'confirmed'
    }).sort({ timeSlot: 1 });

    const pending = await Appointment.find({
        doctorName: req.user.name,
        status: 'pending'
    }).sort({ date: 1, timeSlot: 1 });

    res.status(200).json({ schedule, pending });
});

module.exports = {
    bookAppointment,
    getAppointments,
    updateAppointmentStatus,
    getPatientDashboard,
    getDoctorDashboard,
};
