import React, { useState, useEffect } from 'react';
import CoinCard from '../CoinCard/CoinCard';
// REMOVED: import PriceChart from '../Chart/PriceChart';
import { useCryptoData } from '../../hooks/useCryptoData';
import styles from './Dashboard.module.css';
// REMOVED: import SearchBar from '../SearchBar/SearchBar';

const Dashboard = ({ 
  watchlist, 
  onAddToWatchlist, 
  onRemoveFromWatchlist,
  selectedCoin, 
  onCoinSelect,
}) => {
  const [sortBy, setSortBy] = useState('market_cap_desc');
  const [limit, setLimit] = useState(50);

  // Custom hook for fetching crypto data
  const { data: coins, loading, error, refetch } = useCryptoData({
    endpoint: 'markets',
    params: { 
      vs_currency: 'usd', 
      order: sortBy, 
      per_page: limit,
      price_change_percentage: '1h,24h,7d'
    }
  });

  // Auto-refresh data every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 300000); //Changed from 60000 to 300000

    return () => clearInterval(interval);
  }, [refetch]);
  
  const isInWatchlist = (coinId) => {
    return watchlist.some(coin => coin.id === coinId);
  };

  if (loading && !coins.length) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading market data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h3>⚠️ Error Loading Data</h3>
        <p>{error}</p>
        <button onClick={refetch} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      
      {/* SearchBar is removed */}

      {/* Market Summary */}
      <div className={styles.marketSummary}>
        <div className={styles.summaryCard}>
          <h3>Total Market Cap</h3>
          <p className={styles.marketValue}>
            ${coins.reduce((sum, coin) => sum + coin.market_cap, 0).toLocaleString()}
          </p>
        </div>
        <div className={styles.summaryCard}>
          <h3>24h Volume</h3>
          <p className={styles.marketValue}>
            ${coins.reduce((sum, coin) => sum + coin.total_volume, 0).toLocaleString()}
          </p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Active Coins</h3>
          <p className={styles.marketValue}>{coins.length}</p>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.sortControls}>
          <label htmlFor="sort-select">Sort by:</label>
          <select 
            id="sort-select"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.select}
          >
            <option value="market_cap_desc">Market Cap (High to Low)</option>
            <option value="market_cap_asc">Market Cap (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
            <option value="price_asc">Price (Low to High)</option>
            <option value="percent_change_24h_desc">24h Change (High to Low)</option>
            <option value="percent_change_24h_asc">24h Change (Low to High)</option>
          </select>
        </div>

        <div className={styles.limitControls}>
          <label htmlFor="limit-select">Show:</label>
          <select 
            id="limit-select"
            value={limit} 
            onChange={(e) => setLimit(Number(e.target.value))}
            className={styles.select}
          >
            <option value={25}>25 coins</option>
            <option value={50}>50 coins</option>
            <option value={100}>100 coins</option>
          </select>
        </div>

        <button 
          onClick={refetch} 
          className={styles.refreshButton}
          disabled={loading}
        >
          {loading ? '🔄' : '↻'} Refresh
        </button>
      </div>

      {/* Selected Coin Chart is removed */}
      
      {/* Coins Grid */}
      <div className={styles.coinsGrid}>
        {coins.map((coin, index) => (
          <CoinCard
            key={coin.id}
            coin={coin}
            rank={index + 1}
            isInWatchlist={isInWatchlist(coin.id)}
            onToggleWatchlist={() => 
              isInWatchlist(coin.id) 
                ? onRemoveFromWatchlist(coin.id)
                : onAddToWatchlist(coin)
            }
            onSelect={() => onCoinSelect(coin)}
            isSelected={selectedCoin?.id === coin.id}
          />
        ))}
      </div>

      {/* Load More Button */}
      {coins.length >= limit && (
        <div className={styles.loadMoreSection}>
          <button 
            onClick={() => setLimit(limit + 25)}
            className={styles.loadMoreButton}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More Coins'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;