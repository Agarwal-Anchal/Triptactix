const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

// Trip routes
router.post('/', tripController.createTrip);
router.get('/:id', tripController.getTrip);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

// User's trips
router.get('/user/:userId', tripController.getUserTrips);

// Update recommendations
router.put('/:id/recommendations', tripController.updateRecommendations);

module.exports = router;
