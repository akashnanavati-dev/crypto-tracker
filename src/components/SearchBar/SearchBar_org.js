import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { searchCoins } from '../../services/cryptoAPI';
import { debounce } from '../../utils/formatters';
import styles from './SearchBar.module.css';

const SearchBar = ({ onCoinSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setShowResults(false);
        return;
      }

      try {
        setLoading(true);
        const data = await searchCoins(searchQuery);
        setResults(data.coins || []);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300)
  ).current;

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  // Handle coin selection
  const handleCoinSelect = (coin) => {
    setQuery('');
    setResults([]);
    setShowResults(false);
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
          
          {results.slice(0, 8).map((coin) => (
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
          
          {results.length > 8 && (
            <div className={styles.moreResults}>
              +{results.length - 8} more results...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  onCoinSelect: PropTypes.func.isRequired,
};

export default SearchBar;