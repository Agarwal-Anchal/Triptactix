const express = require('express');
const router = express.Router();
const advisoryController = require('../controllers/advisoryController');

// Advisory generation routes
router.post('/itinerary/:tripId', advisoryController.generateItinerary);
router.post('/destinations/:userId', advisoryController.generateDestinations);
router.post('/packing/:tripId', advisoryController.generatePacking);
router.post('/cuisine/:tripId', advisoryController.generateCuisine);
router.post('/accommodation/:tripId', advisoryController.generateAccommodation);

// Generate all recommendations at once
router.post('/all/:tripId', advisoryController.generateAllRecommendations);

module.exports = router;
