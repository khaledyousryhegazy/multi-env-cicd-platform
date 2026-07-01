const express = require('express');
const router = express.Router();
const { requireMentorAuth } = require('../middleware/auth');
const {
  getAvailability,
  addAvailability,
  createBooking,
  getBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');

router.get('/availability', getAvailability);
router.post('/availability', requireMentorAuth, addAvailability);

router.post('/bookings', createBooking);
router.get('/bookings', requireMentorAuth, getBookings);
router.patch('/bookings/:id', requireMentorAuth, updateBookingStatus);

module.exports = router;
