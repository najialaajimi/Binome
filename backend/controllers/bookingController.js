const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

// @desc    Create booking/visit request
// @route   POST /api/bookings
// @access  Private (Tenant)
exports.createBooking = async (req, res) => {
  try {
    const { listingId, type, visitDetails, rentalDetails } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Annonce non trouvée'
      });
    }

    const booking = await Booking.create({
      listing: listingId,
      tenant: req.user.id,
      owner: listing.owner,
      type,
      visitDetails,
      rentalDetails
    });

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la réservation',
      error: error.message
    });
  }
};

// @desc    Get user's bookings (as tenant)
// @route   GET /api/bookings/my-bookings
// @access  Private (Tenant)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tenant: req.user.id })
      .populate('listing', 'title photos address price')
      .populate('owner', 'firstName lastName avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des réservations',
      error: error.message
    });
  }
};

// @desc    Get booking requests for owner
// @route   GET /api/bookings/requests
// @access  Private (Owner)
exports.getBookingRequests = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = { owner: req.user.id };
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('listing', 'title photos address')
      .populate('tenant', 'firstName lastName avatar email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des demandes',
      error: error.message
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('listing')
      .populate('tenant', 'firstName lastName avatar email phone')
      .populate('owner', 'firstName lastName avatar email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Check if user is involved in this booking
    if (
      booking.tenant._id.toString() !== req.user.id &&
      booking.owner._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à voir cette réservation'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la réservation',
      error: error.message
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Owner)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Check if user is the owner
    if (booking.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cette réservation'
      });
    }

    booking.status = status;
    
    if (status === 'confirmed' && booking.type === 'visit') {
      booking.visitDetails.confirmedAt = new Date();
    }

    await booking.save();

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Check if user is involved
    if (
      booking.tenant.toString() !== req.user.id &&
      booking.owner.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à annuler cette réservation'
      });
    }

    booking.status = 'cancelled';
    booking.cancellation = {
      cancelledBy: req.user.id,
      reason: req.body.reason,
      cancelledAt: new Date()
    };

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Réservation annulée',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'annulation',
      error: error.message
    });
  }
};
