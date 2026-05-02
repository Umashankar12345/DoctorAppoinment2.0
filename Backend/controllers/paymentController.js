const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Appointment = require('../models/appointmentModel');

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private (Patient)
const createOrder = asyncHandler(async (req, res) => {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found');
    }

    if (appointment.paymentStatus === 'paid') {
        res.status(400);
        throw new Error('Appointment is already paid');
    }

    // Amount should be from the doctor's fees or fixed amount, right now we just use a fixed 500 for demo if amount is 0
    // Actually we should get the fee from doctor model or the appointment amount field
    const paymentAmount = appointment.amount > 0 ? appointment.amount : 500;

    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
        amount: paymentAmount * 100, // amount in smallest currency unit (paise)
        currency: "INR",
        receipt: `receipt_order_${appointmentId}`,
    };

    const order = await instance.orders.create(options);

    if (!order) {
        res.status(500);
        throw new Error('Some error occurred while creating Razorpay order');
    }

    // Save order id to appointment
    appointment.razorpayOrderId = order.id;
    await appointment.save();

    res.status(200).json(order);
});

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Private (Patient)
const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;

    // Create our own signature to compare
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
        res.status(400);
        throw new Error('Transaction not legit!');
    }

    // Transaction is legit, update the appointment
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found');
    }

    appointment.paymentStatus = 'paid';
    appointment.razorpayPaymentId = razorpay_payment_id;
    // Status can be changed to confirmed here or leave it to the doctor
    appointment.status = 'confirmed'; 

    await appointment.save();

    res.status(200).json({
        msg: 'Payment verified successfully',
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
    });
});

module.exports = {
    createOrder,
    verifyPayment
};
