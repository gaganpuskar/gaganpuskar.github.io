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

/**
 * POST /api/invoice-finder
 * Search for booking invoices by ID range and customer details
 */
app.post('/api/invoice-finder', async (req, res) => {
  try {
    const { startId, endId, searchType, searchValue } = req.body;

    // Validation
    if (!startId || !endId || !searchType || !searchValue) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    if (parseInt(endId) - parseInt(startId) > 500) {
      return res.status(400).json({
        success: false,
        error: 'Range cannot exceed 500 IDs'
      });
    }

    // Mock implementation - returns sample data for demonstration
    // In production, this would actually scrape/query the Revolt Motors booking pages
    const mockData = {
      'REV001': { name: 'Raj Kumar', mobile: '9443515065', email: 'raj.kumar@email.com', model: 'RV400', price: '137050', hub: 'Revolt Hub Anna Nagar', bookingDate: '2023-01-15' },
      'REV002': { name: 'Priya Singh', mobile: '9876543210', email: 'priya.singh@email.com', model: 'RV400', price: '139200', hub: 'Revolt Hub Bangalore', bookingDate: '2023-02-20' },
      'REV003': { name: 'Kumaran Sivanandham', mobile: '9123456789', email: 'kumaran.s@email.com', model: 'RV300', price: '107050', hub: 'Revolt Hub Chennai', bookingDate: '2023-03-10' },
      'REV004': { name: 'Anita Sharma', mobile: '8765432109', email: 'anita.sharma@email.com', model: 'RV400', price: '140000', hub: 'Revolt Hub Mumbai', bookingDate: '2023-04-05' },
      'REV005': { name: 'Vikram Patel', mobile: '9012345678', email: 'vikram.p@email.com', model: 'RV400', price: '138500', hub: 'Revolt Hub Pune', bookingDate: '2023-05-12' }
    };

    // Search through mock data
    let foundInvoices = [];
    
    for (let i = startId; i <= endId; i++) {
      const bookingId = `REV${String(i).padStart(3, '0')}`;
      const invoice = mockData[bookingId];
      
      if (invoice) {
        // Check if invoice matches search criteria
        let matches = false;
        
        if (searchType === 'phone') {
          matches = invoice.mobile.includes(searchValue.replace(/\D/g, ''));
        } else if (searchType === 'name') {
          matches = invoice.name.toLowerCase().includes(searchValue.toLowerCase());
        } else if (searchType === 'email') {
          matches = invoice.email.toLowerCase().includes(searchValue.toLowerCase());
        }

        if (matches) {
          foundInvoices.push({
            bookingId,
            ...invoice,
            invoiceUrl: `https://www.revoltmotors.com/thankyoubooking/${bookingId}`
          });
        }
      }
    }

    if (foundInvoices.length === 0) {
      return res.json({
        success: true,
        found: false,
        message: 'No matching invoices found in the specified range'
      });
    }

    // Return first match or all matches
    const firstMatch = foundInvoices[0];
    
    res.json({
      success: true,
      found: true,
      bookingId: firstMatch.bookingId,
      name: firstMatch.name,
      mobile: firstMatch.mobile,
      email: firstMatch.email,
      model: firstMatch.model,
      price: firstMatch.price,
      hub: firstMatch.hub,
      bookingDate: firstMatch.bookingDate,
      invoiceUrl: firstMatch.invoiceUrl,
      allMatches: foundInvoices,
      matchCount: foundInvoices.length
    });

  } catch (error) {
    console.error('Invoice finder error:', error);
    res.status(500).json({
      success: false,
      error: 'Error searching for invoices'
    });
  }
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
