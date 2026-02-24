const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    department: {
        type: String,
        required: [true, 'Please select a department'],
    },
    doctorName: {
        type: String,
        required: [true, 'Please select a doctor'],
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    doctorPhone: {
        type: String,
    },
    patientName: {
        type: String,
        required: [true, 'Please add patient name'],
    },
    date: {
        type: String,
        required: [true, 'Please add a date'],
    },
    timeSlot: {
        type: String,
        required: [true, 'Please add a time slot'],
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Appointment', appointmentSchema);
