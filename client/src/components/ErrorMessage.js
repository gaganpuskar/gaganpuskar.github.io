import React from 'react';

function ErrorMessage({ message }) {
  return (
    <div className="error-container">
      <div className="error-message">
        <span className="error-icon">⚠️</span>
        {message}
      </div>
    </div>
  );
}

export default ErrorMessage;
