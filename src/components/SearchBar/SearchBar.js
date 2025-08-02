import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { searchCoins } from '../../services/cryptoAPI';
import useDebounce from '../../hooks/tempDebounce';
import styles from './SearchBar.module.css';

const SearchBar = ({ onCoinSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Use the custom debounce hook to get a debounced query value
  const debouncedQuery = useDebounce(query, 300);

  // This effect will run ONLY when debouncedQuery changes
  useEffect(() => {
    // Only search if the query is not empty
    if (debouncedQuery) {
      const fetchSearchResults = async () => {
        try {
          setLoading(true);
          const data = await searchCoins(debouncedQuery);
          setResults(data.coins || []);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      };

      fetchSearchResults();
    } else {
      // Clear results if the query is empty
      setResults([]);
      setShowResults(false);
    }
  }, [debouncedQuery]);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  // Handle coin selection
  const handleCoinSelect = (coin) => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    // Call the parent's onCoinSelect function
    if (onCoinSelect) {
      onCoinSelect(coin);
    }
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.searchContainer} ref={searchRef}>
      <div className={styles.searchInputWrapper}>
        <input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query && setShowResults(true)}
          className={styles.searchInput}
        />
        <div className={styles.searchIcon}>
          {loading ? '⏳' : '🔍'}
        </div>
      </div>

      {showResults && (
        <div className={styles.searchResults}>
          {results.length === 0 && !loading && (
            <div className={styles.noResults}>
              No cryptocurrencies found for "{query}"
            </div>
          )}

          {/* This will now render all search results */}
          {results.map((coin) => (
            <div
              key={coin.id}
              className={styles.searchResultItem}
              onClick={() => handleCoinSelect(coin)}
            >
              <img
                src={coin.large || coin.thumb}
                alt={coin.name}
                className={styles.resultImage}
              />
              <div className={styles.resultInfo}>
                <span className={styles.resultName}>{coin.name}</span>
                <span className={styles.resultSymbol}>{coin.symbol}</span>
              </div>
              <span className={styles.resultRank}>#{coin.market_cap_rank || 'N/A'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  onCoinSelect: PropTypes.func.isRequired,
};

export default SearchBar;