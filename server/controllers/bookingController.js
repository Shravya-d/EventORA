const Booking = require('../models/Booking.js');
const OTP = require('../models/OTP.js');
const { sendOtpEmail, sendBookingEmail } = require('../utils/email.js');
const Event = require('../models/Event.js');
const User = require('../models/User.js');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.sendBookingOTP = async (req, res) => {
    const otp = generateOTP();
    await OTP.findOneAndDelete({ email: req.user.email, action: 'event_booking' });
    await OTP.create({ email: req.user.email, otp, action: 'event_booking' });
    await sendOtpEmail(req.user.email, otp, 'event_booking');
    res.json({ message: 'OTP sent to email for booking confirmation' });
};

exports.bookEvent = async (req, res) => {
    const { eventId } = req.body;

    const otpRecord = await OTP.findOne({ email: req.user.email, action: 'event_booking' });
    if (!otpRecord) {
        return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
    }
    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }
    if (event.totalSeats <= 0) {
        return res.status(400).json({ error: 'No seats available' });
    }

    const existingBooking = await Booking.findOne({ userId: req.user._id, eventId });
    if (existingBooking) {
        return res.status(400).json({ error: 'You have already booked this event' });
    }

    const booking = await Booking.create({
        userId: req.user._id,
        eventId,
        status: 'pending',
        paymentStatus: 'non_paid',
        amount: event.ticketPrice,

    });

    await OTP.findOneAndDelete({ email: req.user.email, action: 'event_booking' });

    res.status(201).json({ message: 'Booking successful. Please check your email for confirmation.' });
}

exports.confirmBooking = async (req, res) => {
    try {
        const paymentStatus = req.body.paymentStatus;

        const booking = await Booking.findById(req.params.id)
            .populate('userId', 'email')
            .populate('eventId');

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.status === 'confirmed') {
            return res.status(400).json({ error: 'Already confirmed' });
        }

        const event = await Event.findById(booking.eventId._id);

        booking.status = 'confirmed';
        booking.paymentStatus = paymentStatus || 'paid';

        await booking.save();

        event.totalSeats -= 1;
        await event.save();

        // ✅ correct email send
        await sendBookingEmail(
            booking.userId.email,
            booking._id,
            event.title
        );

        res.json({ message: 'Booking confirmed' });

    } catch (error) {
        console.error("CONFIRM ERROR:", error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.getMyBookings = async (req, res) => {
    const bookings = await Booking.find({ userId: req.user._id }).populate('eventId');
    res.json(bookings);
};

exports.cancelBooking = async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
    }
    if (booking.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    booking.status = 'cancelled';
    await booking.save();

    if (booking.status === 'confirmed') {
        const event = await Event.findById(booking.eventId);
        event.totalSeats += 1;
        await event.save();
    }
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking cancelled' });
};
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'email')
            .populate('eventId', 'title');

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteAllBookings = async (req, res) => {
    try {
        await Booking.deleteMany(); // 🔥 deletes all bookings
        res.json({ message: "All bookings deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};