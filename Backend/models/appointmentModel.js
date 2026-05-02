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
    isActive: {
        type: Boolean,
        default: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
});

// Prevent double booking for the same doctor, date, and time slot
// We use a partialFilterExpression so that if an appointment is 'cancelled', 
// isActive becomes false, and the slot becomes available again for others to book.
appointmentSchema.index(
    { doctor: 1, date: 1, timeSlot: 1 },
    { unique: true, partialFilterExpression: { isActive: true } }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
