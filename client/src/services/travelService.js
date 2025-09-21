import api from './api.js';

export const userService = {
  // Create a new user
  async createUser(userData) {
    const response = await api.post('/users', userData);
    return response;
  },

  // Get user by ID
  async getUser(userId) {
    const response = await api.get(`/users/${userId}`);
    return response;
  },

  // Update user preferences
  async updateUser(userId, userData) {
    const response = await api.put(`/users/${userId}`, userData);
    return response;
  },

  // Delete user
  async deleteUser(userId) {
    const response = await api.delete(`/users/${userId}`);
    return response;
  },

  // Get all users (for development)
  async getAllUsers() {
    const response = await api.get('/users');
    return response;
  },

  // Create a trip for a user
  async createTrip(tripData) {
    const response = await api.post('/trips', tripData);
    return response;
  }
};

export const tripService = {
  // Create a new trip
  async createTrip(tripData) {
    const response = await api.post('/trips', tripData);
    return response;
  },

  // Get trip by ID
  async getTrip(tripId) {
    const response = await api.get(`/trips/${tripId}`);
    return response;
  },

  // Update trip
  async updateTrip(tripId, tripData) {
    const response = await api.put(`/trips/${tripId}`, tripData);
    return response;
  },

  // Delete trip
  async deleteTrip(tripId) {
    const response = await api.delete(`/trips/${tripId}`);
    return response;
  },

  // Get user's trips
  async getUserTrips(userId) {
    const response = await api.get(`/trips/user/${userId}`);
    return response;
  },

  // Update trip recommendations
  async updateRecommendations(tripId, type, data) {
    const response = await api.put(`/trips/${tripId}/recommendations`, { type, data });
    return response;
  }
};

export const advisoryService = {
  // Generate itinerary
  async generateItinerary(tripId) {
    const response = await api.post(`/advisory/itinerary/${tripId}`);
    return response;
  },

  // Generate destination recommendations
  async generateDestinations(userId) {
    const response = await api.post(`/advisory/destinations/${userId}`);
    return response;
  },

  // Generate packing list
  async generatePacking(tripId) {
    const response = await api.post(`/advisory/packing/${tripId}`);
    return response;
  },

  // Generate cuisine recommendations
  async generateCuisine(tripId) {
    const response = await api.post(`/advisory/cuisine/${tripId}`);
    return response;
  },

  // Generate accommodation recommendations
  async generateAccommodation(tripId) {
    const response = await api.post(`/advisory/accommodation/${tripId}`);
    return response;
  },

  // Generate all recommendations
  async generateAllRecommendations(tripId) {
    const response = await api.post(`/advisory/all/${tripId}`);
    return response;
  }
};
