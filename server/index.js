const express = require('express');
const cors = require('cors');
const path = require('path');
const puppeteer = require('puppeteer');
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
 * Uses headless browser to scrape actual Revolt Motors booking pages
 */
app.post('/api/invoice-finder', async (req, res) => {
  let browser = null;

  try {
    const { startId, endId, searchType, searchValue } = req.body;

    // Validation
    if (!startId || !endId || !searchType || !searchValue) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const start = parseInt(startId);
    const end = parseInt(endId);

    if (end < start) {
      return res.status(400).json({
        success: false,
        error: 'End ID must be greater than or equal to Start ID'
      });
    }

    if (end - start > 500) {
      return res.status(400).json({
        success: false,
        error: 'Range cannot exceed 500 IDs'
      });
    }

    console.log(`\n🔍 Searching from ${start} to ${end} by ${searchType}: ${searchValue}`);

    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
      timeout: 30000
    });

    const page = await browser.newPage();
    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(15000);

    let foundInvoices = [];
    const baseUrl = 'https://www.revoltmotors.com/thankyoubooking';

    // Helper function to extract data from booking page
    const fetchAndParseBooking = async (bookingId) => {
      try {
        const url = `${baseUrl}/${bookingId}`;
        console.log(`  ▶ Checking: ${bookingId}...`);

        // Navigate to page
        await page.goto(url, { 
          waitUntil: 'networkidle2',
          timeout: 12000 
        });

        // Wait for page to load and extract all text
        const pageData = await page.evaluate(() => {
          const text = document.body.innerText;
          const html = document.body.innerHTML;
          
          // Extract phone numbers (Indian mobile number pattern)
          const phoneMatch = text.match(/\b9\d{9}\b/);
          
          // Extract emails
          const emailMatch = text.match(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/);
          
          // Extract name - look for "Name" label and get the next word(s) up to newline or specific keywords
          let name = '';
          const nameLines = text.split('\n');
          for (let i = 0; i < nameLines.length; i++) {
            const line = nameLines[i];
            if (line.match(/^Name\s*$/i) || line.match(/^Name\s+(.+)/i)) {
              // If "Name" is alone on a line, next line has the name
              if (line.match(/^Name\s*$/i) && i + 1 < nameLines.length) {
                name = nameLines[i + 1].trim();
              } else {
                // "Name" and value on same line
                const match = line.match(/^Name\s+(.+)/i);
                if (match) {
                  name = match[1].trim();
                }
              }
              // Clean up: remove anything after common keywords
              name = name.split(/\s*(Email|Phone|Mobile|Address|Hub|Status|ID|Pincode)/i)[0].trim();
              if (name) break;
            }
          }

          // Extract model (RV300, RV400, etc)
          const modelMatch = text.match(/\b(RV\d{3,4})\b/i);
          
          // Extract price
          const priceMatch = text.match(/₹\s*([\d,]+)|(\d+)\s*(?:INR|rupee)/i);

          return {
            name: name || 'N/A',
            phone: phoneMatch ? phoneMatch[0] : '',
            email: emailMatch ? emailMatch[0] : '',
            model: modelMatch ? modelMatch[1] : 'N/A',
            price: priceMatch ? priceMatch[1] || priceMatch[2] : 'N/A',
            fullText: text.substring(0, 500)
          };
        });

        // Only return if we found some data
        if (pageData.phone || pageData.email || pageData.name !== 'N/A') {
          return {
            bookingId: String(bookingId),
            name: pageData.name,
            mobile: pageData.phone,
            email: pageData.email,
            model: pageData.model,
            price: pageData.price,
            hub: 'N/A',
            bookingDate: new Date().toISOString().split('T')[0]
          };
        }

        return null;

      } catch (error) {
        // Page not found or error - continue to next
        return null;
      }
    };

    // Process bookings in the range - stop after finding first match
    for (let i = start; i <= end; i++) {
      try {
        const bookingData = await fetchAndParseBooking(i);

        if (bookingData) {
          // Check if booking matches search criteria
          let matches = false;

          if (searchType === 'phone') {
            const searchDigits = searchValue.replace(/\D/g, '');
            matches = bookingData.mobile.replace(/\D/g, '').includes(searchDigits);
          } else if (searchType === 'name') {
            matches = bookingData.name.toLowerCase().includes(searchValue.toLowerCase());
          } else if (searchType === 'email') {
            matches = bookingData.email.toLowerCase().includes(searchValue.toLowerCase());
          }

          if (matches) {
            foundInvoices.push({
              ...bookingData,
              invoiceUrl: `${baseUrl}/${bookingData.bookingId}`
            });
            console.log(`✓ MATCH FOUND: ${bookingData.bookingId}`);
            break; // Stop after first match
          }
        }
      } catch (err) {
        console.error(`  ✗ Error checking ${i}:`, err.message);
        continue;
      }
    }

    await browser.close();

    if (foundInvoices.length === 0) {
      return res.json({
        success: true,
        found: false,
        message: 'No matching invoices found in the specified range',
        searchedIds: { start, end }
      });
    }

    const firstMatch = foundInvoices[0];

    res.json({
      success: true,
      found: true,
      bookingId: firstMatch.bookingId,
      name: firstMatch.name || 'N/A',
      mobile: firstMatch.mobile || 'N/A',
      email: firstMatch.email || 'N/A',
      model: firstMatch.model || 'N/A',
      price: firstMatch.price || 'N/A',
      hub: firstMatch.hub || 'N/A',
      bookingDate: firstMatch.bookingDate,
      invoiceUrl: firstMatch.invoiceUrl,
      allMatches: foundInvoices,
      matchCount: foundInvoices.length
    });

  } catch (error) {
    console.error('🔴 Invoice finder error:', error.message);
    
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.error('Error closing browser:', e.message);
      }
    }

    res.status(500).json({
      success: false,
      error: 'Error searching for invoices: ' + error.message
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
