const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    packageId: {
      type: String,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      enum: ['domestic', 'international'],
      required: true
    },
    country: {
      type: String,
      required: true
    },
    theme: {
      type: String,
      default: 'luxury'
    },
    nights: {
      type: Number,
      required: true
    },
    days: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    originalPrice: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 4.8
    },
    reviewsCount: {
      type: Number,
      default: 24
    },
    heroImage: {
      type: String,
      required: true
    },
    gallery: [String],
    overview: {
      type: String,
      default: ''
    },
    highlights: [String],
    itinerary: [
      {
        day: Number,
        title: String,
        description: String
      }
    ],
    inclusions: [String],
    exclusions: [String],
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Package', packageSchema);
