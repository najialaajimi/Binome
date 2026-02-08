const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  rating: {
    overall: {
      type: Number,
      required: [true, 'La note est requise'],
      min: 1,
      max: 5
    },
    cleanliness: {
      type: Number,
      min: 1,
      max: 5
    },
    accuracy: {
      type: Number,
      min: 1,
      max: 5
    },
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    location: {
      type: Number,
      min: 1,
      max: 5
    },
    value: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  title: {
    type: String,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  content: {
    type: String,
    required: [true, 'Le contenu de l\'avis est requis'],
    maxlength: [1000, 'L\'avis ne peut pas dépasser 1000 caractères']
  },
  photos: [{
    url: String,
    caption: String
  }],
  response: {
    content: String,
    respondedAt: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  reportCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Ensure one review per user per listing
reviewSchema.index({ listing: 1, reviewer: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function(listingId) {
  const stats = await this.aggregate([
    { $match: { listing: listingId, isPublished: true } },
    {
      $group: {
        _id: '$listing',
        averageRating: { $avg: '$rating.overall' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Listing').findByIdAndUpdate(listingId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews
    });
  }
};

// Update listing rating after save
reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.listing);
});

// Update listing rating after remove
reviewSchema.post('remove', function() {
  this.constructor.calculateAverageRating(this.listing);
});

module.exports = mongoose.model('Review', reviewSchema);
