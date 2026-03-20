import React, { useState } from 'react';
import axios from 'axios';
import '../styles/InvoiceFinder.css';

function InvoiceFinder({ apiUrl }) {
  const [bookingId, setBookingId] = useState('');
  const [searchType, setSearchType] = useState('phone');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE_URL = apiUrl || 'https://revolt-backend-j7j9.onrender.com' || 'http://localhost:5000';

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!bookingId.trim() || !searchValue.trim()) {
      setError('Please enter Booking ID and search value');
      return;
    }

    const bid = parseInt(bookingId);
    if (isNaN(bid)) {
      setError('Booking ID must be a number');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Call API with the booking ID
      const response = await axios.post(`${API_BASE_URL}/api/invoice-finder`, {
        startId: bid,
        endId: bid,
        searchType: searchType,
        searchValue: searchValue.toLowerCase().trim()
      });

      if (response.data.found) {
        setResults({
          ...response.data,
          bookingUrl: `https://www.revoltmotors.com/thankyoubooking/${bid}`
        });
      } else {
        setError(`No match found for ${searchType}: ${searchValue}`);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.error || err.message || 'Error searching invoice');
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholder = () => {
    const placeholders = {
      phone: '9876543210',
      name: 'John Doe',
      email: 'john@example.com'
    };
    return placeholders[searchType] || '';
  };

  return (
    <div className="invoice-finder-container">
      <div className="invoice-finder-card">
        <div className="finder-header">
          <h2>🔍 Revolt Invoice Finder</h2>
          <p>Find your booking invoice using Booking ID</p>
        </div>

        {error && <div className="error-message">❌ {error}</div>}

        <form onSubmit={handleSearch} className="finder-form">
          {/* Booking ID Input */}
          <div className="form-section">
            <label htmlFor="bookingId"><strong>Booking ID</strong></label>
            <input
              id="bookingId"
              type="number"
              placeholder="e.g., 600103"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              disabled={loading}
              className="booking-input"
            />
            <small>📝 Enter your booking ID from the URL</small>
          </div>

          {/* Search Type Selection */}
          <div className="form-section">
            <label><strong>Search By</strong></label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="searchType"
                  value="phone"
                  checked={searchType === 'phone'}
                  onChange={(e) => setSearchType(e.target.value)}
                  disabled={loading}
                />
                <span>📱 Mobile Number</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="searchType"
                  value="name"
                  checked={searchType === 'name'}
                  onChange={(e) => setSearchType(e.target.value)}
                  disabled={loading}
                />
                <span>👤 Customer Name</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="searchType"
                  value="email"
                  checked={searchType === 'email'}
                  onChange={(e) => setSearchType(e.target.value)}
                  disabled={loading}
                />
                <span>✉️ Email Address</span>
              </label>
            </div>
          </div>

          {/* Search Value Input */}
          <div className="form-section">
            <label htmlFor="searchValue"><strong>
              {searchType === 'phone' && 'Your Mobile Number'}
              {searchType === 'name' && 'Customer Name'}
              {searchType === 'email' && 'Email Address'}
            </strong></label>
            <input
              id="searchValue"
              type="text"
              placeholder={getPlaceholder()}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              disabled={loading}
              className="search-input"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="search-button"
            disabled={loading}
          >
            {loading ? '🔄 Searching...' : '🔎 Find Invoice'}
          </button>
        </form>

        {/* Results */}
        {results && (
          <div className="results-section">
            <div className="success-message">✅ Booking Found!</div>
            
            <div className="result-details">
              <div className="detail-row">
                <span className="label">Booking ID:</span>
                <span className="value">{results.bookingId}</span>
              </div>
              <div className="detail-row">
                <span className="label">Name:</span>
                <span className="value">{results.name || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Mobile:</span>
                <span className="value">{results.mobile || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Email:</span>
                <span className="value">{results.email || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Model:</span>
                <span className="value">{results.model || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Price:</span>
                <span className="value">{results.price ? `₹${results.price?.toLocaleString()}` : 'N/A'}</span>
              </div>
            </div>

            <div className="action-buttons">
              <a 
                href={results.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="download-button"
              >
                💾 Download Invoice
              </a>
              <button 
                onClick={() => {
                  setResults(null);
                  setBookingId('');
                  setSearchValue('');
                }}
                className="new-search-button"
              >
                🔍 New Search
              </button>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="info-section">
          <h4>ℹ️ How to use:</h4>
          <ol>
            <li>Get your <strong>Booking ID</strong> from the URL</li>
            <li>Select search type (Phone, Name, or Email)</li>
            <li>Enter your details</li>
            <li>Click "Find Invoice"</li>
            <li>Download your booking confirmation!</li>
          </ol>
          <p><strong>Example URL:</strong> https://www.revoltmotors.com/thankyoubooking/<code>600103</code></p>
        </div>
      </div>
    </div>
  );
}

export default InvoiceFinder;
