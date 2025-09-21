// MongoDB initialization script for TripTactix
db = db.getSiblingDB('trip-tactix');

// Create collections
db.createCollection('users');
db.createCollection('trips');

// Create indexes for better performance
db.users.createIndex({ "name": 1 });
db.users.createIndex({ "createdAt": 1 });

db.trips.createIndex({ "userId": 1 });
db.trips.createIndex({ "destination": 1 });
db.trips.createIndex({ "startDate": 1 });
db.trips.createIndex({ "createdAt": 1 });

print('TripTactix database initialized successfully!');
