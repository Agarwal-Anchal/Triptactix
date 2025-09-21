const Trip = require('../models/Trip');
const User = require('../models/User');

const tripController = {
  // Create a new trip
  async createTrip(req, res) {
    try {
      const tripData = req.body;
      
      // Verify user exists
      const user = await User.findById(tripData.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const trip = new Trip(tripData);
      await trip.save();
      
      res.status(201).json({
        success: true,
        message: 'Trip created successfully',
        trip: trip
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to create trip',
        error: error.message
      });
    }
  },

  // Get trip by ID
  async getTrip(req, res) {
    try {
      const { id } = req.params;
      const trip = await Trip.findById(id).populate('userId', 'name ageRange travelStyle');
      
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found'
        });
      }

      res.json({
        success: true,
        trip: trip
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch trip',
        error: error.message
      });
    }
  },

  // Get all trips for a user
  async getUserTrips(req, res) {
    try {
      const { userId } = req.params;
      const trips = await Trip.find({ userId }).sort({ createdAt: -1 });
      
      res.json({
        success: true,
        count: trips.length,
        trips: trips
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user trips',
        error: error.message
      });
    }
  },

  // Update trip
  async updateTrip(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const trip = await Trip.findByIdAndUpdate(
        id, 
        updates, 
        { new: true, runValidators: true }
      );
      
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found'
        });
      }

      res.json({
        success: true,
        message: 'Trip updated successfully',
        trip: trip
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to update trip',
        error: error.message
      });
    }
  },

  // Delete trip
  async deleteTrip(req, res) {
    try {
      const { id } = req.params;
      const trip = await Trip.findByIdAndDelete(id);
      
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found'
        });
      }

      res.json({
        success: true,
        message: 'Trip deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete trip',
        error: error.message
      });
    }
  },

  // Update trip recommendations
  async updateRecommendations(req, res) {
    try {
      const { id } = req.params;
      const { type, data } = req.body;
      
      if (!['itinerary', 'destinations', 'packing', 'cuisine', 'accommodation'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid recommendation type'
        });
      }

      const updateField = {};
      updateField[`recommendations.${type}.data`] = data;
      updateField[`recommendations.${type}.generated`] = true;
      updateField[`recommendations.${type}.generatedAt`] = new Date();

      const trip = await Trip.findByIdAndUpdate(
        id,
        { $set: updateField },
        { new: true }
      );

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found'
        });
      }

      res.json({
        success: true,
        message: `${type} recommendations updated successfully`,
        trip: trip
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to update recommendations',
        error: error.message
      });
    }
  }
};

module.exports = tripController;
