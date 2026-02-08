const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createBooking,
  getMyBookings,
  getBookingRequests,
  getBooking,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');

// All routes are protected
router.use(protect);

// Tenant routes
router.post('/', authorize('tenant'), createBooking);
router.get('/my-bookings', authorize('tenant'), getMyBookings);

// Owner routes
router.get('/requests', authorize('owner', 'admin'), getBookingRequests);

// Shared routes
router.get('/:id', getBooking);
router.put('/:id/status', authorize('owner', 'admin'), updateBookingStatus);
router.put('/:id/cancel', cancelBooking);

module.exports = router;
