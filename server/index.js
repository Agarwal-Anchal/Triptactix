require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory (built client)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trip-tactix')
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'TripTactix API Server is running!' });
});

// Reset route for experimentation
app.get('/api/reset', async (req, res) => {
  try {
    // Clear all collections
    await mongoose.connection.db.collection('users').deleteMany({});
    await mongoose.connection.db.collection('trips').deleteMany({});
    
    res.json({ 
      message: 'Database reset successfully! All users and trips have been cleared.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Reset error:', error);
    res.status(500).json({ 
      error: 'Failed to reset database',
      message: error.message 
    });
  }
});

// API Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/advisory', require('./routes/advisory'));

// Serve React app for all non-API routes (catch-all)
app.use((req, res, next) => {
  // If it's an API route, let it continue to 404
  if (req.path.startsWith('/api/')) {
    return next();
  }
  // For all other routes, serve the React app
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
