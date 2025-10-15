require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes (match spelling/case!)
const userRoutes = require('./routes/userRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const collectionsRoutes = require('./routes/collectionsRoutes');
const celestialObjectsRoutes = require('./routes/celestialObjectsRoutes'); // <-- Correct name

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Register API routes
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/collections', collectionsRoutes);
app.use('/api/celestialobjects', celestialObjectsRoutes); // <-- This must be before 404
app.use('/api/objects', celestialObjectsRoutes);

app.get('/', (req, res) => res.send("AstroAtlas backend running"));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
