import React, { useState } from 'react';
import '../styles/LoginPage.css';

function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === 'pushkaR@143') {
      setError('');
      onLogin();
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>🏍️ Revolt Bike Price Search</h1>
          <p className="login-subtitle">Enter Password to Access</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
              autoFocus
            />
          </div>

          {error && <div className="error-text">{error}</div>}

          <button type="submit" className="login-button">
            Access
          </button>
        </form>

        <div className="login-footer">
          <p>🔒 Secure Access</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
