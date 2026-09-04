const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    packageId: {
      type: String,
      required: true
    },
    packageTitle: {
      type: String,
      required: true
    },
    travelerName: {
      type: String,
      required: true
    },
    travelerEmail: {
      type: String,
      required: true
    },
    travelerPhone: {
      type: String,
      required: true
    },
    travelersCount: {
      type: Number,
      default: 1,
      min: 1
    },
    travelDate: {
      type: Date,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    },
    specialRequests: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
