import React from 'react';
import PropTypes from 'prop-types';
import CoinCard from '../CoinCard/CoinCard';
import { useCryptoData } from '../../hooks/useCryptoData';
import styles from './Watchlist.module.css';

const Watchlist = ({ watchlist, onRemoveFromWatchlist, onSelectCoin, selectedCoin }) => {
  // Get updated data for watchlist coins
  const coinIds = watchlist.map(coin => coin.id).join(',');
  const { data: updatedCoins, loading, error } = useCryptoData({
    endpoint: 'markets',
    params: {
      ids: coinIds,
      vs_currency: 'usd',
      price_change_percentage: '1h,24h,7d'
    },
    refreshInterval: 60000 // Refresh every 60 seconds
  });

  if (watchlist.length === 0) {
    return (
      <div className={styles.emptyWatchlist}>
        <div className={styles.emptyIcon}>⭐</div>
        <h2>Your Watchlist is Empty</h2>
        <p>Add cryptocurrencies to your watchlist from the dashboard to track them here.</p>
        <div className={styles.emptyHint}>
          <p>💡 <strong>Tip:</strong> Click the star icon on any coin card to add it to your watchlist</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading watchlist data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h3>⚠️ Error Loading Watchlist</h3>
        <p>{error}</p>
      </div>
    );
  }

  // Calculate portfolio summary
  const portfolioValue = updatedCoins.reduce((sum, coin) => sum + coin.current_price, 0);
  const averageChange24h = updatedCoins.reduce((sum, coin) => sum + (coin.price_change_percentage_24h || 0), 0) / updatedCoins.length;

  return (
    <div className={styles.watchlist}>
      {/* Watchlist Summary */}
      <div className={styles.watchlistHeader}>
        <h2>Your Watchlist</h2>
        <div className={styles.watchlistStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total Coins</span>
            <span className={styles.statValue}>{watchlist.length}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Combined Price</span>
            <span className={styles.statValue}>${portfolioValue.toFixed(2)}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Avg 24h Change</span>
            <span className={`${styles.statValue} ${averageChange24h >= 0 ? styles.positive : styles.negative}`}>
              {averageChange24h >= 0 ? '+' : ''}{averageChange24h.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Watchlist Actions */}
      <div className={styles.watchlistActions}>
        <button 
          onClick={() => {
            if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
              watchlist.forEach(coin => onRemoveFromWatchlist(coin.id));
            }
          }}
          className={styles.clearButton}
        >
          🗑️ Clear All
        </button>
        <span className={styles.actionHint}>
          Click the star on any coin to remove it from your watchlist
        </span>
      </div>

      {/* Watchlist Grid */}
      <div className={styles.watchlistGrid}>
        {updatedCoins.map((coin, index) => (
          <CoinCard
            key={coin.id}
            coin={coin}
            rank={index + 1}
            isInWatchlist={true}
            onToggleWatchlist={() => onRemoveFromWatchlist(coin.id)}
            onSelect={() => onSelectCoin && onSelectCoin(coin)} 
            isSelected={selectedCoin?.id === coin.id} // <-- ADDED PROP
          />
        ))}
      </div>
    </div>
  );
};

Watchlist.propTypes = {
  watchlist: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })).isRequired,
  onRemoveFromWatchlist: PropTypes.func.isRequired,
  onSelectCoin: PropTypes.func,
  selectedCoin: PropTypes.object, // <-- ADDED PROP
};

export default Watchlist;