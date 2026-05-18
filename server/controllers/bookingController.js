const Booking = require('../models/Booking.js');
const OTP = require('../models/OTP.js');
const { sendOtpEmail, sendBookingEmail } = require('../utils/email.js');
const Event = require('../models/Event.js');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendBookingOTP = async (req, res, next) => {
    try {
        const otp = generateOTP();
        await OTP.findOneAndDelete({ email: req.user.email, action: 'event_booking' });
        await OTP.create({ email: req.user.email, otp, action: 'event_booking' });
        await sendOtpEmail(req.user.email, otp, 'event_booking');
        res.json({ message: 'OTP sent to email for booking confirmation' });
    } catch (error) {
        next(error);
    }
};

exports.bookEvent = async (req, res, next) => {
    try {
        const { eventId } = req.body;

        const otpRecord = await OTP.findOne({ email: req.user.email, action: 'event_booking' });
        if (!otpRecord) {
            return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
        }
        
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        if (event.availableSeats <= 0) {
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

        res.status(201).json({ message: 'Booking pending confirmation. Please check your email for confirmation.', bookingId: booking._id });
    } catch (error) {
        next(error);
    }
};

exports.confirmBooking = async (req, res, next) => {
    try {
        const paymentStatus = req.body.paymentStatus;
        const bookingId = req.params.id;

        const booking = await Booking.findById(bookingId).populate('userId', 'email').populate('eventId');
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.status === 'confirmed') {
            return res.status(400).json({ error: 'Already confirmed' });
        }

        // Atomically decrement availableSeats using findOneAndUpdate to prevent race conditions
        const event = await Event.findOneAndUpdate(
            { _id: booking.eventId._id, availableSeats: { $gt: 0 } },
            { $inc: { availableSeats: -1 } },
            { new: true }
        );

        if (!event) {
            return res.status(400).json({ error: 'Failed to confirm booking. No seats available.' });
        }

        booking.status = 'confirmed';
        booking.paymentStatus = paymentStatus || 'paid';
        await booking.save();

        await sendBookingEmail(booking.userId.email, booking._id, event.title);

        res.json({ message: 'Booking confirmed' });
    } catch (error) {
        next(error);
    }
};

exports.getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id }).populate('eventId');
        res.json(bookings);
    } catch (error) {
        next(error);
    }
};

exports.cancelBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        if (booking.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ error: 'Booking is already cancelled' });
        }

        const wasConfirmed = booking.status === 'confirmed';
        
        booking.status = 'cancelled';
        await booking.save();

        if (wasConfirmed) {
            // Restore available seat
            await Event.findByIdAndUpdate(
                booking.eventId,
                { $inc: { availableSeats: 1 } }
            );
        }
        
        // Optionally delete it or keep it as history
        await Booking.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        next(error);
    }
};

exports.getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'email')
            .populate('eventId', 'title');

        res.json(bookings);
    } catch (error) {
        next(error);
    }
};

exports.deleteAllBookings = async (req, res, next) => {
    try {
        await Booking.deleteMany();
        res.json({ message: "All bookings deleted successfully" });
    } catch (error) {
        next(error);
    }
};