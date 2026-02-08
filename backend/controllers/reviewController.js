const Review = require('../models/Review');
const Listing = require('../models/Listing');

// @desc    Get reviews for a listing
// @route   GET /api/reviews/listing/:listingId
// @access  Public
exports.getListingReviews = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const reviews = await Review.find({ 
      listing: listingId,
      isPublished: true 
    })
      .populate('reviewer', 'firstName lastName avatar')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Review.countDocuments({ 
      listing: listingId,
      isPublished: true 
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des avis',
      error: error.message
    });
  }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private (Tenant)
exports.createReview = async (req, res) => {
  try {
    const { listingId, rating, title, content, photos } = req.body;

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Annonce non trouvée'
      });
    }

    // Check if user already reviewed this listing
    const existingReview = await Review.findOne({
      listing: listingId,
      reviewer: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà évalué cette annonce'
      });
    }

    const review = await Review.create({
      listing: listingId,
      reviewer: req.user.id,
      rating,
      title,
      content,
      photos
    });

    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'firstName lastName avatar');

    res.status(201).json({
      success: true,
      data: populatedReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'avis',
      error: error.message
    });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    // Check ownership
    if (review.reviewer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cet avis'
      });
    }

    const { rating, title, content, photos } = req.body;

    review = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, title, content, photos },
      { new: true, runValidators: true }
    ).populate('reviewer', 'firstName lastName avatar');

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'avis',
      error: error.message
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    // Check ownership or admin
    if (review.reviewer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer cet avis'
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Avis supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'avis',
      error: error.message
    });
  }
};

// @desc    Respond to a review (Owner)
// @route   POST /api/reviews/:id/respond
// @access  Private (Owner)
exports.respondToReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('listing', 'owner');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    // Check if user is the listing owner
    if (review.listing.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Seul le propriétaire peut répondre à cet avis'
      });
    }

    review.response = {
      content: req.body.content,
      respondedAt: new Date()
    };

    await review.save();

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réponse à l\'avis',
      error: error.message
    });
  }
};

// @desc    Get owner's reviews
// @route   GET /api/reviews/my-reviews
// @access  Private (Owner)
exports.getMyListingsReviews = async (req, res) => {
  try {
    // Get owner's listings
    const listings = await Listing.find({ owner: req.user.id }).select('_id');
    const listingIds = listings.map(l => l._id);

    const reviews = await Review.find({ listing: { $in: listingIds } })
      .populate('reviewer', 'firstName lastName avatar')
      .populate('listing', 'title photos')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des avis',
      error: error.message
    });
  }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
exports.markHelpful = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      helpfulCount: review.helpfulCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message
    });
  }
};
