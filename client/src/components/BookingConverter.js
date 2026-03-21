import React, { useState, useEffect } from 'react';
import '../styles/BookingConverter.css';

function BookingConverter() {
  const [bookingNumber, setBookingNumber] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [opened, setOpened] = useState(false);

  // Real-time conversion as user types
  useEffect(() => {
    if (!bookingNumber.trim()) {
      setError(null);
      setResult(null);
      setOpened(false);
      return;
    }

    const num = parseInt(bookingNumber);
    if (isNaN(num)) {
      setError('Please enter a valid number');
      setResult(null);
      setOpened(false);
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

    // Auto-open URL if not already opened
    if (!opened) {
      window.open(url, '_blank');
      setOpened(true);
    }
  }, [bookingNumber, opened]);

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
            <input
              id="bookingNumber"
              type="number"
              placeholder="e.g., 188196"
              value={bookingNumber}
              onChange={(e) => setBookingNumber(e.target.value)}
              className="booking-input"
              autoFocus
            />
            <small>📝 Enter your booking number - URL opens automatically!</small>
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
                  setOpened(false);
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
