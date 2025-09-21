const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Basic info
  name: {
    type: String,
    required: true,
    trim: true
  },
  ageRange: {
    type: String,
    enum: ['18-25', '26-35', '36-50', '51-65', '65+'],
    required: true
  },
  
  // Travel preferences
  travelStyle: {
    type: String,
    enum: ['adventure', 'relaxation', 'cultural', 'mixed'],
    required: true
  },
  budgetRange: {
    type: String,
    enum: ['budget', 'mid-range', 'luxury'],
    required: true
  },
  
  // Dietary preferences
  dietaryRestrictions: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher', 'dairy-free', 'nut-free', 'none']
  }],
  
  // Group type
  groupType: {
    type: String,
    enum: ['solo', 'couple', 'family', 'friends'],
    required: true
  },
  
  // Interests
  interests: [{
    type: String,
    enum: ['culture', 'food', 'nature', 'nightlife', 'history', 'art', 'adventure', 'shopping', 'beaches', 'museums', 'architecture', 'festivals']
  }],
  
  // Energy level for activities
  energyLevel: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    default: 'moderate'
  },
  
  // Accommodation preferences
  accommodationPreferences: [{
    type: String,
    enum: ['hotel', 'hostel', 'airbnb', 'resort', 'boutique', 'budget']
  }],
  
  // Location preferences
  locationPreferences: [{
    type: String,
    enum: ['city-center', 'quiet-area', 'beach-front', 'mountain', 'historic-district']
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
