import React, { useState } from 'react';
import '../styles/InvoiceFinder.css';

function InvoiceFinder() {
  const [bookingId, setBookingId] = useState('');

  const handleOpen = (e) => {
    e.preventDefault();
    
    if (!bookingId.trim()) {
      alert('Please enter Booking ID');
      return;
    }

    const bid = parseInt(bookingId);
    if (isNaN(bid)) {
      alert('Booking ID must be a number');
      return;
    }

    // Open the booking URL directly
    const url = `https://www.revoltmotors.com/thankyoubooking/${bid}`;
    window.open(url, '_blank');
  };

  return (
    <div className="invoice-finder-container">
      <div className="invoice-finder-card">
        <div className="finder-header">
          <h2>🔍 Revolt Invoice Finder</h2>
          <p>Open your booking invoice</p>
        </div>

        <form onSubmit={handleOpen} className="finder-form">
          {/* Booking ID Input */}
          <div className="form-section">
            <label htmlFor="bookingId"><strong>Booking ID</strong></label>
            <input
              id="bookingId"
              type="number"
              placeholder="e.g., 600103"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              className="booking-input"
              autoFocus
            />
            <small>📝 Example: https://www.revoltmotors.com/thankyoubooking/<code>600103</code></small>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="search-button"
          >
            🔗 Open Invoice
          </button>
        </form>

        {/* Help Section */}
        <div className="info-section">
          <h4>ℹ️ How to use:</h4>
          <ol>
            <li>Enter your <strong>Booking ID</strong></li>
            <li>Click "Open Invoice"</li>
            <li>Done! 🎉</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default InvoiceFinder;
