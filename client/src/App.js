import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import SearchBox from './components/SearchBox';
import ResultsTable from './components/ResultsTable';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import LoginPage from './components/LoginPage';
import InvoiceFinder from './components/InvoiceFinder';

// API URL configuration - use environment variable or localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'invoices'
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const auth = localStorage.getItem('revolt_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch available hubs for autocomplete (only when authenticated)
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchHubs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/hubs`);
        if (response.data.success) {
          setSuggestions(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching hubs:', err);
      }
    };

    fetchHubs();
  }, [isAuthenticated]);

  const handleLogin = () => {
    localStorage.setItem('revolt_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('revolt_auth');
    setIsAuthenticated(false);
    setSearchQuery('');
    setResults([]);
    setHasSearched(false);
    setError(null);
  };

  const handleSearch = async (hubName) => {
    if (!hubName.trim()) {
      setError('Please enter a Hub Name');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await axios.get(`${API_URL}/api/search`, {
        params: { hubName }
      });

      if (response.data.success) {
        if (response.data.data.length === 0) {
          setResults([]);
          setError('No Hub Found');
        } else {
          setResults(response.data.data);
          setError(null);
        }
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.error || 'Error searching for bikes');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      {activeTab === 'search' ? (
        <div className="container">
          <header className="header">
            <div className="header-content">
              <div>
                <h1>🏍️ Revolt Bike Price Search</h1>
                <p className="subtitle">Find Revolt bike prices by Hub Name</p>
              </div>
              <div className="header-buttons">
                <button 
                  className="nav-button nav-button-secondary" 
                  onClick={() => setActiveTab('invoices')}
                >
                  📄 Invoice Finder
                </button>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </header>

          <SearchBox
            onSearch={handleSearch}
            suggestions={suggestions}
            value={searchQuery}
            onChange={setSearchQuery}
          />

          {error && !loading && <ErrorMessage message={error} />}

          {loading && <LoadingSpinner />}

          {hasSearched && !loading && results.length > 0 && (
            <ResultsTable results={results} />
          )}

          {hasSearched && !loading && results.length === 0 && !error && (
            <div className="no-results">No bikes found for this hub</div>
          )}
        </div>
      ) : (
        <div className="container">
          <header className="header">
            <div className="header-content">
              <div>
                <h1>📄 Invoice Finder</h1>
                <p className="subtitle">Search and download booking invoices</p>
              </div>
              <div className="header-buttons">
                <button 
                  className="nav-button nav-button-secondary" 
                  onClick={() => setActiveTab('search')}
                >
                  🏍️ Price Search
                </button>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </header>

          <InvoiceFinder apiUrl={API_URL} />
        </div>
      )}
    </div>
  );
}

export default App;
