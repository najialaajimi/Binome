const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['visit', 'reservation', 'rental'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'],
    default: 'pending'
  },
  visitDetails: {
    scheduledDate: Date,
    scheduledTime: String,
    notes: String,
    confirmedAt: Date
  },
  rentalDetails: {
    startDate: Date,
    endDate: Date,
    monthlyRent: Number,
    deposit: Number,
    totalAmount: Number
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'partial', 'completed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['cash', 'bank-transfer', 'card', 'mobile-payment']
    },
    transactions: [{
      amount: Number,
      date: Date,
      reference: String,
      type: {
        type: String,
        enum: ['deposit', 'rent', 'refund']
      }
    }]
  },
  contract: {
    url: String,
    signedByTenant: Boolean,
    signedByOwner: Boolean,
    signedAt: Date
  },
  cancellation: {
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    cancelledAt: Date
  },
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    sentAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
