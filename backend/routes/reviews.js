const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const {
  getListingReviews,
  createReview,
  updateReview,
  deleteReview,
  respondToReview,
  getMyListingsReviews,
  markHelpful
} = require('../controllers/reviewController');

// Review validation
const reviewValidation = [
  body('listingId').notEmpty().withMessage('L\'ID de l\'annonce est requis'),
  body('rating.overall')
    .isInt({ min: 1, max: 5 })
    .withMessage('La note doit être entre 1 et 5'),
  body('content').trim().notEmpty().withMessage('Le contenu de l\'avis est requis')
];

// Public routes
router.get('/listing/:listingId', getListingReviews);

// Protected routes
router.use(protect);

router.post('/', authorize('tenant'), reviewValidation, validate, createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
router.post('/:id/respond', authorize('owner'), respondToReview);
router.get('/my-listings', authorize('owner'), getMyListingsReviews);
router.post('/:id/helpful', markHelpful);

module.exports = router;
