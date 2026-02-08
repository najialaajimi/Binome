const User = require('../models/User');
const Listing = require('../models/Listing');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTenants = await User.countDocuments({ role: 'tenant' });
    const totalOwners = await User.countDocuments({ role: 'owner' });
    const totalListings = await Listing.countDocuments();
    const activeListings = await Listing.countDocuments({ status: 'active' });
    const pendingListings = await Listing.countDocuments({ status: 'pending' });
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });

    // Recent activity
    const recentUsers = await User.find()
      .sort('-createdAt')
      .limit(5)
      .select('firstName lastName email role createdAt');

    const recentListings = await Listing.find()
      .sort('-createdAt')
      .limit(5)
      .select('title status createdAt')
      .populate('owner', 'firstName lastName');

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          tenants: totalTenants,
          owners: totalOwners
        },
        listings: {
          total: totalListings,
          active: activeListings,
          pending: pendingListings
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings
        },
        recentActivity: {
          users: recentUsers,
          listings: recentListings
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search, status } = req.query;

    let query = {};

    if (role) {
      query.role = role;
    }

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error.message
    });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive, role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive, role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message
    });
  }
};

// @desc    Get all listings for moderation
// @route   GET /api/admin/listings
// @access  Private (Admin)
exports.getAllListings = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, reported } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (reported === 'true') {
      query.reportCount = { $gt: 0 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const listings = await Listing.find(query)
      .populate('owner', 'firstName lastName email')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const total = await Listing.countDocuments(query);

    res.status(200).json({
      success: true,
      count: listings.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      data: listings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des annonces',
      error: error.message
    });
  }
};

// @desc    Update listing status (moderate)
// @route   PUT /api/admin/listings/:id/status
// @access  Private (Admin)
exports.updateListingStatus = async (req, res) => {
  try {
    const { status, verified, featured } = req.body;

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status, verified, featured },
      { new: true, runValidators: true }
    ).populate('owner', 'firstName lastName email');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Annonce non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: listing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message
    });
  }
};

// @desc    Delete listing (admin)
// @route   DELETE /api/admin/listings/:id
// @access  Private (Admin)
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Annonce non trouvée'
      });
    }

    await listing.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Annonce supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
};

// @desc    Get reported reviews
// @route   GET /api/admin/reviews
// @access  Private (Admin)
exports.getReportedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reportCount: { $gt: 0 } })
      .populate('reviewer', 'firstName lastName')
      .populate('listing', 'title')
      .sort('-reportCount');

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

// @desc    Delete review (admin)
// @route   DELETE /api/admin/reviews/:id
// @access  Private (Admin)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
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
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
};
