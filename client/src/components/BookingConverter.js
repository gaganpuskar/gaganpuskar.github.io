import React, { useState } from 'react';
import '../styles/BookingConverter.css';

function BookingConverter() {
  const [bookingNumber, setBookingNumber] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleConvert = (e) => {
    e.preventDefault();
    
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

    setResult({
      input: num,
      bookingId: bookingId,
      url: url
    });
    setError(null);
  };

  return (
    <div className="booking-converter-container">
      <div className="converter-card">
        <div className="converter-header">
          <h2>🔗 Booking Number Converter</h2>
          <p>Convert your booking number to Revolt Motors URL</p>
        </div>

        {error && <div className="error-message">❌ {error}</div>}

        <form onSubmit={handleConvert} className="converter-form">
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
            <small>📝 Enter your booking number</small>
          </div>

          <button 
            type="submit" 
            className="convert-button"
          >
            🔄 Convert
          </button>
        </form>

        {result && (
          <div className="result-section">
            <div className="success-message">✅ Conversion Successful!</div>
            
            <div className="result-details">
              <div className="result-row">
                <span className="label">Input Number:</span>
                <span className="value">{result.input}</span>
              </div>
              <div className="result-row">
                <span className="label">Formula:</span>
                <span className="value">{result.input} + 412004 = {result.bookingId}</span>
              </div>
              <div className="result-row">
                <span className="label">Booking ID:</span>
                <span className="value">{result.bookingId}</span>
              </div>
              <div className="result-row">
                <span className="label">URL:</span>
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
                🌐 Open URL
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

        {/* Help Section */}
        <div className="info-section">
          <h4>ℹ️ How it works:</h4>
          <ol>
            <li>Enter your <strong>Booking Number</strong></li>
            <li>Click "Convert"</li>
            <li>Formula: Booking Number + 412004 = URL ID</li>
            <li>Click "Open URL" to view on Revolt Motors</li>
          </ol>
          <p><strong>Examples:</strong></p>
          <ul>
            <li><code>188196</code> → <code>600200</code></li>
            <li><code>188197</code> → <code>600201</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BookingConverter;
