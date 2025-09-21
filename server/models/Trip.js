const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Trip details
  destination: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // days
    required: true
  },
  
  // Party details
  partySize: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  
  // Generated recommendations
  recommendations: {
    itinerary: {
      generated: { type: Boolean, default: false },
      data: { type: mongoose.Schema.Types.Mixed },
      generatedAt: { type: Date }
    },
    destinations: {
      generated: { type: Boolean, default: false },
      data: { type: mongoose.Schema.Types.Mixed },
      generatedAt: { type: Date }
    },
    packing: {
      generated: { type: Boolean, default: false },
      data: { type: mongoose.Schema.Types.Mixed },
      generatedAt: { type: Date }
    },
    cuisine: {
      generated: { type: Boolean, default: false },
      data: { type: mongoose.Schema.Types.Mixed },
      generatedAt: { type: Date }
    },
    accommodation: {
      generated: { type: Boolean, default: false },
      data: { type: mongoose.Schema.Types.Mixed },
      generatedAt: { type: Date }
    }
  },
  
  // Status
  status: {
    type: String,
    enum: ['planning', 'booked', 'completed'],
    default: 'planning'
  }
}, {
  timestamps: true
});

// Virtual for trip duration calculation
tripSchema.virtual('calculatedDuration').get(function() {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return this.duration;
});

module.exports = mongoose.model('Trip', tripSchema);
