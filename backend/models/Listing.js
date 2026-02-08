const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  propertyType: {
    type: String,
    required: [true, 'Le type de propriété est requis'],
    enum: ['studio', 'apartment', 'room', 'shared-room', 'house', 'residence']
  },
  address: {
    street: {
      type: String,
      required: [true, 'L\'adresse est requise']
    },
    city: {
      type: String,
      required: [true, 'La ville est requise']
    },
    state: String,
    postalCode: String,
    country: {
      type: String,
      default: 'Tunisie'
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  nearbyUniversities: [{
    name: String,
    distance: Number // in km
  }],
  nearbyTransport: [{
    type: String,
    name: String,
    distance: Number
  }],
  price: {
    amount: {
      type: Number,
      required: [true, 'Le prix est requis']
    },
    currency: {
      type: String,
      default: 'TND'
    },
    period: {
      type: String,
      enum: ['day', 'week', 'month', 'year'],
      default: 'month'
    },
    deposit: Number,
    utilities: {
      included: Boolean,
      amount: Number
    }
  },
  size: {
    area: Number, // in m²
    rooms: Number,
    bedrooms: Number,
    bathrooms: Number
  },
  amenities: [{
    type: String,
    enum: [
      'wifi', 'tv', 'aircon', 'heating', 'washer', 'dryer',
      'kitchen', 'parking', 'elevator', 'balcony', 'garden',
      'pool', 'gym', 'security', 'furnished', 'pets-allowed',
      'smoking-allowed', 'wheelchair-accessible'
    ]
  }],
  photos: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    isMain: {
      type: Boolean,
      default: false
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  virtualTour: {
    url: String,
    provider: String
  },
  availability: {
    startDate: {
      type: Date,
      required: [true, 'La date de disponibilité est requise']
    },
    endDate: Date,
    minStay: {
      type: Number,
      default: 1 // in months
    },
    maxStay: Number
  },
  rules: {
    maxOccupants: Number,
    genderPreference: {
      type: String,
      enum: ['any', 'male', 'female']
    },
    studentOnly: Boolean,
    noParties: Boolean,
    quietHours: {
      start: String,
      end: String
    }
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'rented', 'inactive', 'suspended'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  },
  favorites: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  reportCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search
listingSchema.index({ 
  title: 'text', 
  description: 'text', 
  'address.city': 'text' 
});

// Index for geospatial queries
listingSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Listing', listingSchema);
