import React, { useState } from 'react';
import axios from 'axios';
import '../styles/InvoiceFinder.css';

function InvoiceFinder({ apiUrl }) {
  const [startId, setStartId] = useState('');
  const [endId, setEndId] = useState('');
  const [searchType, setSearchType] = useState('phone');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE_URL = apiUrl || 'https://revolt-backend-j7j9.onrender.com' || 'http://localhost:5000';

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!startId || !endId || !searchValue) {
      setError('Please fill all fields');
      return;
    }

    if (parseInt(endId) < parseInt(startId)) {
      setError('End ID must be greater than Start ID');
      return;
    }

    if (parseInt(endId) - parseInt(startId) > 500) {
      setError('Range cannot exceed 500 IDs');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/invoice-finder`, {
        startId: parseInt(startId),
        endId: parseInt(endId),
        searchType: searchType,
        searchValue: searchValue.toLowerCase().trim()
      });

      if (response.data.found) {
        setResults(response.data);
      } else {
        setError('No matching invoice found in the specified range');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.error || 'Error searching for invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (results && results.bookingId) {
      const url = `https://www.revoltmotors.com/thankyoubooking/${results.bookingId}`;
      // Open in new tab for PDF download
      window.open(url, '_blank');
    }
  };

  return (
    <div className="invoice-finder-container">
      <div className="invoice-finder-card">
        <h2>🔍 Invoice Finder</h2>
        <p className="subtitle">Find booking invoices by ID range from Revolt Motors</p>

        <form onSubmit={handleSearch} className="invoice-form">
          {/* ID Range Section */}
          <div className="form-section">
            <h3>Booking ID Range</h3>
            <div className="input-row">
              <div className="input-group">
                <label>Start Booking ID</label>
                <input
                  type="number"
                  placeholder="e.g., 600445"
                  value={startId}
                  onChange={(e) => setStartId(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="input-group">
                <label>End Booking ID</label>
                <input
                  type="number"
                  placeholder="e.g., 600900"
                  value={endId}
                  onChange={(e) => setEndId(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Search Type Section */}
          <div className="form-section">
            <h3>Search By</h3>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="phone"
                  checked={searchType === 'phone'}
                  onChange={(e) => setSearchType(e.target.value)}
                  disabled={loading}
                />
                Mobile Number
              </label>
              <label>
                <input
                  type="radio"
                  value="name"
                  checked={searchType === 'name'}
                  onChange={(e) => setSearchType(e.target.value)}
                  disabled={loading}
                />
                Customer Name
              </label>
              <label>
                <input
                  type="radio"
                  value="email"
                  checked={searchType === 'email'}
                  onChange={(e) => setSearchType(e.target.value)}
                  disabled={loading}
                />
                Email Address
              </label>
            </div>
          </div>

          {/* Search Value Section */}
          <div className="form-section">
            <h3>Enter Your {searchType === 'phone' ? 'Mobile Number' : searchType === 'name' ? 'Name' : 'Email'}</h3>
            <input
              type="text"
              placeholder={
                searchType === 'phone' ? '9443515065' : 
                searchType === 'name' ? 'kumaran sivanandham' : 
                'your@email.com'
              }
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              disabled={loading}
              className="search-input"
            />
          </div>

          {/* Error Display */}
          {error && <div className="error-message">{error}</div>}

          {/* Search Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="search-button"
          >
            {loading ? (
              <>
                <span className="spinner"></span> Searching ({endId ? parseInt(endId) - parseInt(startId) + 1 : 0} bookings)...
              </>
            ) : (
              '🔎 Find Invoice'
            )}
          </button>
        </form>

        {/* Results Display */}
        {results && (
          <div className="results-section">
            <h3>✅ Invoice Found!</h3>
            <div className="invoice-details">
              <div className="detail-row">
                <span className="label">Name:</span>
                <span className="value">{results.name}</span>
              </div>
              <div className="detail-row">
                <span className="label">Mobile:</span>
                <span className="value">{results.mobile}</span>
              </div>
              <div className="detail-row">
                <span className="label">Email:</span>
                <span className="value">{results.email}</span>
              </div>
              <div className="detail-row">
                <span className="label">Bike Model:</span>
                <span className="value">{results.model}</span>
              </div>
              <div className="detail-row">
                <span className="label">Price:</span>
                <span className="value">₹{results.price?.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="label">Hub:</span>
                <span className="value">{results.hub}</span>
              </div>
              <div className="detail-row">
                <span className="label">Booking Date:</span>
                <span className="value">{results.bookingDate}</span>
              </div>
            </div>
            <button onClick={handleDownload} className="download-button">
              📥 Download Invoice (PDF)
            </button>
          </div>
        )}

        {/* Info Section */}
        <div className="info-section">
          <h4>ℹ️ How to use:</h4>
          <ul>
            <li>Get your booking ID from the URL: revoltmotors.com/thankyoubooking/<b>600445</b></li>
            <li>Enter the ID range (e.g., 600445 to 600600)</li>
            <li>Select search type: Phone, Name, or Email</li>
            <li>Bot scans each booking page and matches your details</li>
            <li>Click "Download Invoice" to open your booking page</li>
            <li>Max range: 500 IDs per search</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default InvoiceFinder;
