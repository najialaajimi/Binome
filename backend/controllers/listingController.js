const Listing = require('../models/Listing');

// @desc    Get all listings with filters
// @route   GET /api/listings
// @access  Public
exports.getListings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      city,
      minPrice,
      maxPrice,
      propertyType,
      amenities,
      minRooms,
      university,
      lat,
      lng,
      radius,
      search
    } = req.query;

    // Build query
    let query = { status: 'active' };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // City filter
    if (city) {
      query['address.city'] = new RegExp(city, 'i');
    }

    // Price range
    if (minPrice || maxPrice) {
      query['price.amount'] = {};
      if (minPrice) query['price.amount'].$gte = Number(minPrice);
      if (maxPrice) query['price.amount'].$lte = Number(maxPrice);
    }

    // Property type
    if (propertyType) {
      query.propertyType = propertyType;
    }

    // Amenities
    if (amenities) {
      const amenitiesArray = amenities.split(',');
      query.amenities = { $all: amenitiesArray };
    }

    // Minimum rooms
    if (minRooms) {
      query['size.rooms'] = { $gte: Number(minRooms) };
    }

    // Nearby university
    if (university) {
      query['nearbyUniversities.name'] = new RegExp(university, 'i');
    }

    // Geospatial query
    if (lat && lng && radius) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: Number(radius) * 1000 // Convert km to meters
        }
      };
    }

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const listings = await Listing.find(query)
      .populate('owner', 'firstName lastName avatar')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Listing.countDocuments(query);

    res.status(200).json({
      success: true,
      count: listings.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
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

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
exports.getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('owner', 'firstName lastName avatar phone email createdAt');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Annonce non trouvée'
      });
    }

    // Increment views
    listing.views += 1;
    await listing.save();

    res.status(200).json({
      success: true,
      data: listing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'annonce',
      error: error.message
    });
  }
};

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private (Owner)
exports.createListing = async (req, res) => {
  try {
    req.body.owner = req.user.id;

    const listing = await Listing.create(req.body);

    res.status(201).json({
      success: true,
      data: listing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'annonce',
      error: error.message
    });
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private (Owner)
exports.updateListing = async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Annonce non trouvée'
      });
    }

    // Check ownership
    if (listing.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cette annonce'
      });
    }

    listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: listing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'annonce',
      error: error.message
    });
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private (Owner/Admin)
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Annonce non trouvée'
      });
    }

    // Check ownership
    if (listing.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer cette annonce'
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
      message: 'Erreur lors de la suppression de l\'annonce',
      error: error.message
    });
  }
};

// @desc    Get owner's listings
// @route   GET /api/listings/my-listings
// @access  Private (Owner)
exports.getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user.id })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de vos annonces',
      error: error.message
    });
  }
};

// @desc    Get featured listings
// @route   GET /api/listings/featured
// @access  Public
exports.getFeaturedListings = async (req, res) => {
  try {
    const listings = await Listing.find({ 
      status: 'active',
      featured: true 
    })
      .populate('owner', 'firstName lastName avatar')
      .limit(6);

    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des annonces en vedette',
      error: error.message
    });
  }
};

// @desc    Toggle favorite
// @route   POST /api/listings/:id/favorite
// @access  Private
exports.toggleFavorite = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    const user = req.user;

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Annonce non trouvée'
      });
    }

    const favoriteIndex = user.favorites.indexOf(listing._id);
    
    if (favoriteIndex > -1) {
      user.favorites.splice(favoriteIndex, 1);
      listing.favorites -= 1;
    } else {
      user.favorites.push(listing._id);
      listing.favorites += 1;
    }

    await user.save();
    await listing.save();

    res.status(200).json({
      success: true,
      isFavorite: favoriteIndex === -1,
      message: favoriteIndex === -1 ? 'Ajouté aux favoris' : 'Retiré des favoris'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des favoris',
      error: error.message
    });
  }
};
