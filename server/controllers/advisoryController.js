const aiService = require('../services/geminiService');
const Trip = require('../models/Trip');
const User = require('../models/User');

const advisoryController = {
  // Generate itinerary recommendations
  async generateItinerary(req, res) {
    try {
      const { tripId } = req.params;
      
      const trip = await Trip.findById(tripId).populate('userId');
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found'
        });
      }

      const recommendations = await aiService.generateItinerary(trip.userId, trip);
      
      // Save recommendations to trip
      await Trip.findByIdAndUpdate(tripId, {
        $set: {
          'recommendations.itinerary.data': recommendations,
          'recommendations.itinerary.generated': true,
          'recommendations.itinerary.generatedAt': new Date()
        }
      });

      res.json({
        success: true,
        type: 'itinerary',
        recommendations: recommendations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate itinerary',
        error: error.message
      });
    }
  },

  // Generate destination recommendations (independent of trips)
  async generateDestinations(req, res) {
    try {
      const { userId } = req.params;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const recommendations = await aiService.generateDestinations(user);

      res.json({
        success: true,
        type: 'destinations',
        recommendations: recommendations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate destination recommendations',
        error: error.message
      });
    }
  },

  // Generate packing list
  async generatePacking(req, res) {
    try {
      const { tripId } = req.params;
      
      const trip = await Trip.findById(tripId).populate('userId');
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found'
        });
      }

      const recommendations = await aiService.generatePackingList(trip.userId, trip);
      
      // Save recommendations to trip
      await Trip.findByIdAndUpdate(tripId, {
        $set: {
          'recommendations.packing.data': recommendations,
          'recommendations.packing.generated': true,
          'recommendations.packing.generatedAt': new Date()
        }
      });

      res.json({
        success: true,
        type: 'packing',
        recommendations: recommendations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate packing list',
        error: error.message
      });
    }
  },

  // Generate cuisine recommendations
  async generateCuisine(req, res) {
    try {
      const { tripId } = req.params;
      
      const trip = await Trip.findById(tripId).populate('userId');
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found'
        });
      }

      const recommendations = await aiService.generateCuisineRecommendations(trip.userId, trip);
      
      // Save recommendations to trip
      await Trip.findByIdAndUpdate(tripId, {
        $set: {
          'recommendations.cuisine.data': recommendations,
          'recommendations.cuisine.generated': true,
          'recommendations.cuisine.generatedAt': new Date()
        }
      });

      res.json({
        success: true,
        type: 'cuisine',
        recommendations: recommendations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate cuisine recommendations',
        error: error.message
      });
    }
  },

  // Generate accommodation recommendations
  async generateAccommodation(req, res) {
    try {
      const { tripId } = req.params;
      
      const trip = await Trip.findById(tripId).populate('userId');
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found'
        });
      }

      const recommendations = await aiService.generateAccommodationRecommendations(trip.userId, trip);
      
      // Save recommendations to trip
      await Trip.findByIdAndUpdate(tripId, {
        $set: {
          'recommendations.accommodation.data': recommendations,
          'recommendations.accommodation.generated': true,
          'recommendations.accommodation.generatedAt': new Date()
        }
      });

      res.json({
        success: true,
        type: 'accommodation',
        recommendations: recommendations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate accommodation recommendations',
        error: error.message
      });
    }
  },

  // Generate all recommendations for a trip
  async generateAllRecommendations(req, res) {
    try {
      const { tripId } = req.params;
      
      const trip = await Trip.findById(tripId).populate('userId');
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found'
        });
      }

      const recommendations = {};
      
      // Generate all recommendations in parallel
      const [itinerary, packing, cuisine, accommodation] = await Promise.allSettled([
        aiService.generateItinerary(trip.userId, trip),
        aiService.generatePackingList(trip.userId, trip),
        aiService.generateCuisineRecommendations(trip.userId, trip),
        aiService.generateAccommodationRecommendations(trip.userId, trip)
      ]);

      // Process results
      if (itinerary.status === 'fulfilled') {
        recommendations.itinerary = itinerary.value;
      }
      if (packing.status === 'fulfilled') {
        recommendations.packing = packing.value;
      }
      if (cuisine.status === 'fulfilled') {
        recommendations.cuisine = cuisine.value;
      }
      if (accommodation.status === 'fulfilled') {
        recommendations.accommodation = accommodation.value;
      }

      // Update trip with all recommendations
      const updateFields = {};
      Object.keys(recommendations).forEach(type => {
        updateFields[`recommendations.${type}.data`] = recommendations[type];
        updateFields[`recommendations.${type}.generated`] = true;
        updateFields[`recommendations.${type}.generatedAt`] = new Date();
      });

      await Trip.findByIdAndUpdate(tripId, { $set: updateFields });

      res.json({
        success: true,
        message: 'All recommendations generated successfully',
        recommendations: recommendations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate recommendations',
        error: error.message
      });
    }
  }
};

module.exports = advisoryController;
