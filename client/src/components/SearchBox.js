import React, { useState } from 'react';

function SearchBox({ onSearch, suggestions, value, onChange }) {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val);

    if (val.trim() === '') {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    } else {
      const filtered = suggestions.filter(hub =>
        hub.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
    setShowSuggestions(false);
  };

  return (
    <div className="search-box-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Enter Hub Name (e.g., Delhi, Mumbai)..."
            value={value}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <button type="submit" className="search-button">
            <span>🔍</span> Search
          </button>
        </div>

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="suggestions-list">
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </form>
      <p className="search-info">💡 Case-insensitive search</p>
    </div>
  );
}

export default SearchBox;
