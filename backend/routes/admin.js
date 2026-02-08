const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAllListings,
  updateListingStatus,
  deleteListing,
  getReportedReviews,
  deleteReview
} = require('../controllers/adminController');

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/stats', getDashboardStats);

// Users management
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);

// Listings moderation
router.get('/listings', getAllListings);
router.put('/listings/:id/status', updateListingStatus);
router.delete('/listings/:id', deleteListing);

// Reviews moderation
router.get('/reviews', getReportedReviews);
router.delete('/reviews/:id', deleteReview);

module.exports = router;
