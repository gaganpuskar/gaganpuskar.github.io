const express = require('express');
const cors = require('cors');
const path = require('path');
const { searchByHubName } = require('./utils/excelHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build')));

// API Routes

/**
 * GET /api/search?hubName=<name>
 * Search for bikes by hub name (case-insensitive)
 */
app.get('/api/search', (req, res) => {
  const { hubName } = req.query;

  if (!hubName || hubName.trim() === '') {
    return res.status(400).json({
      error: 'Hub Name is required',
      success: false
    });
  }

  try {
    const results = searchByHubName(hubName.trim());
    
    if (results.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'No Hub Found'
      });
    }

    res.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      error: 'Server error during search',
      success: false
    });
  }
});

/**
 * GET /api/hubs
 * Get list of all available hubs
 */
app.get('/api/hubs', (req, res) => {
  try {
    const hubs = require('./utils/excelHandler').getAllHubs();
    res.json({
      success: true,
      data: hubs
    });
  } catch (error) {
    console.error('Error fetching hubs:', error);
    res.status(500).json({
      error: 'Server error',
      success: false
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'), (err) => {
    if (err) {
      res.status(500).send('Error loading application');
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    success: false
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ API available at http://localhost:${PORT}/api`);
});

module.exports = app;
