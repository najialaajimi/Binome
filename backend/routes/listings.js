const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
  getFeaturedListings,
  toggleFavorite
} = require('../controllers/listingController');

// Validation rules
const listingValidation = [
  body('title').trim().notEmpty().withMessage('Le titre est requis'),
  body('description').trim().notEmpty().withMessage('La description est requise'),
  body('propertyType').isIn(['studio', 'apartment', 'room', 'shared-room', 'house', 'residence'])
    .withMessage('Type de propriété invalide'),
  body('address.street').notEmpty().withMessage('L\'adresse est requise'),
  body('address.city').notEmpty().withMessage('La ville est requise'),
  body('price.amount').isNumeric().withMessage('Le prix est requis'),
  body('availability.startDate').isISO8601().withMessage('Date de disponibilité invalide')
];

// Public routes
router.get('/', getListings);
router.get('/featured', getFeaturedListings);
router.get('/:id', getListing);

// Protected routes
router.use(protect);

router.get('/user/my-listings', authorize('owner', 'admin'), getMyListings);
router.post('/', authorize('owner', 'admin'), listingValidation, validate, createListing);
router.put('/:id', authorize('owner', 'admin'), updateListing);
router.delete('/:id', authorize('owner', 'admin'), deleteListing);
router.post('/:id/favorite', toggleFavorite);

module.exports = router;
