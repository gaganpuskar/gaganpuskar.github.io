import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import SearchBox from './components/SearchBox';
import ResultsTable from './components/ResultsTable';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Fetch available hubs for autocomplete
  useEffect(() => {
    const fetchHubs = async () => {
      try {
        const response = await axios.get('/api/hubs');
        if (response.data.success) {
          setSuggestions(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching hubs:', err);
      }
    };

    fetchHubs();
  }, []);

  const handleSearch = async (hubName) => {
    if (!hubName.trim()) {
      setError('Please enter a Hub Name');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await axios.get('/api/search', {
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

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>🏍️ Revolt Bike Price Search</h1>
          <p className="subtitle">Find Revolt bike prices by Hub Name</p>
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
    </div>
  );
}

export default App;
