import React, { useState } from 'react';
import '../styles/BookingConverter.css';

function BookingConverter() {
  const [bookingNumber, setBookingNumber] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleOk = () => {
    if (!bookingNumber.trim()) {
      setError('Please enter a booking number');
      setResult(null);
      return;
    }

    const num = parseInt(bookingNumber);
    if (isNaN(num)) {
      setError('Please enter a valid number');
      setResult(null);
      return;
    }

    // Formula: Add 412004 to the input number
    const bookingId = num + 412004;
    const url = `https://www.revoltmotors.com/thankyoubooking/${bookingId}`;

    const newResult = {
      input: num,
      bookingId: bookingId,
      url: url
    };

    setResult(newResult);
    setError(null);

    // Open URL when OK is clicked
    window.open(url, '_blank');
  };

  return (
    <div className="booking-converter-container">
      <div className="converter-card">
        <div className="converter-header">
          <h2>🔗 Booking Number Converter</h2>
          <p>Convert your booking number to Revolt Motors URL</p>
        </div>

        {error && <div className="error-message">❌ {error}</div>}

        <div className="converter-form">
          <div className="form-section">
            <label htmlFor="bookingNumber"><strong>Booking Number</strong></label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                id="bookingNumber"
                type="number"
                placeholder="e.g., 188196"
                value={bookingNumber}
                onChange={(e) => setBookingNumber(e.target.value)}
                className="booking-input"
                style={{ flex: 1 }}
                autoFocus
              />
              <button 
                onClick={handleOk}
                className="convert-button"
                style={{ flex: 0 }}
              >
                OK
              </button>
            </div>
            <small>📝 Enter your booking number and click OK</small>
          </div>
        </div>

        {result && (
          <div className="result-section">
            <div className="success-message">✅ Formula Calculated & URL Opened!</div>
            
            <div className="result-details">
              <div className="result-row">
                <span className="label">Formula:</span>
                <span className="value"><strong>{result.input} + 412004 = {result.bookingId}</strong></span>
              </div>
              <div className="result-row">
                <span className="label">Your URL:</span>
                <span className="value url-text">{result.url}</span>
              </div>
            </div>

            <div className="action-buttons">
              <a 
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="open-button"
              >
                🌐 Open Again
              </a>
              <button 
                onClick={() => {
                  setResult(null);
                  setBookingNumber('');
                  setError(null);
                }}
                className="new-convert-button"
              >
                🔄 Convert Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingConverter;
