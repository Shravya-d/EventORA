const express = require('express');
const router = express.Router();
const { bookEvent, sendBookingOTP, getMyBookings, confirmBooking, cancelBooking, getAllBookings, deleteAllBookings } = require('../controllers/bookingController.js');
const { protect, admin } = require('../middleware/auth.js');
const { get } = require('mongoose');

router.post('/', protect, bookEvent);
router.post('/send-otp', protect, sendBookingOTP);
router.get('/my', protect, getMyBookings);
router.put('/:id/confirm', protect, admin, confirmBooking);
router.delete('/:id', protect, cancelBooking);
router.get('/', protect, admin, getAllBookings);
router.delete('/all', protect, admin, deleteAllBookings);
module.exports = router;