const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    },
    role: {
        type: String,
        enum: ['patient', 'doctor'],
        default: 'patient',
    },
    specialization: {
        type: String,
        required: function () { return this.role === 'doctor'; }
    },
    qualifications: {
        type: String,
    },
    experience: {
        type: Number,
        required: function () { return this.role === 'doctor'; }
    },
    languages: [{
        type: String,
    }],
    consultationModes: [{
        type: String,
        enum: ['in-person', 'video', 'chat'],
    }],
    clinic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinic',
    },
    isVerified: {
        type: Boolean,
        default: true,
    },
    availableSlots: [{
        day: String,
        startTime: String,
        endTime: String
    }],
    state: {
        type: String,
        required: function () { return this.role === 'doctor'; },
        index: true
    },
    district: {
        type: String,
        required: function () { return this.role === 'doctor'; },
        index: true
    },
    area: {
        type: String,
    },
    pincode: {
        type: String,
    },
    location: { // Structured location for filtering
        state: { type: String },
        district: { type: String },
        area: { type: String },
        pincode: { type: String }
    },
    geoPoint: { // Renamed from location to avoid conflict with hierarchy
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    },
    phone: {
        type: String,
        required: function () { return this.role === 'doctor'; }
    },
    fees: {
        type: Number,
        default: 500,
    },
    about: {
        type: String,
    },
    image: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/377/377429.png' // Default doctor/user icon
    },
    rating: {
        type: Number,
        default: 0,
    },
    reviews: [{
        userName: String,
        rating: Number,
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
}, {
    timestamps: true,
});

userSchema.index({ geoPoint: '2dsphere' });
userSchema.index({ "location.state": 1, "location.district": 1, specialization: 1 });
userSchema.index({ state: 1, district: 1, specialization: 1 }); // Existing fields index

module.exports = mongoose.model('User', userSchema);
