const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add clinic name'],
    },
    type: {
        type: String,
        enum: ['clinic', 'hospital', 'diagnostic-center'],
        default: 'clinic',
    },
    address: {
        type: String,
        required: [true, 'Please add address'],
    },
    state: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    timings: {
        type: String,
        default: '9:00 AM - 9:00 PM',
    },
    image: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/4320/4320371.png',
    },
    facilities: [{
        type: String,
    }],
    doctors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
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
            default: Date.now,
        },
    }],
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0],
        },
    },
}, {
    timestamps: true,
});

clinicSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Clinic', clinicSchema);
