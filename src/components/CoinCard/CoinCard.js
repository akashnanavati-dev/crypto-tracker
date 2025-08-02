import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import styles from './CoinCard.module.css';

const CoinCard = ({ 
  coin, 
  rank, 
  isInWatchlist, 
  onToggleWatchlist, 
  onSelect, 
  isSelected 
}) => {
  const {
    name,
    symbol,
    image,
    current_price,
    market_cap,
    market_cap_rank,
    price_change_percentage_24h,
    price_change_percentage_7d,
    total_volume,
    high_24h,
    low_24h
  } = coin;

  const priceChange24h = price_change_percentage_24h || 0;
  const priceChange7d = price_change_percentage_7d || 0;
  const isPositive24h = priceChange24h >= 0;
  const isPositive7d = priceChange7d >= 0;

  return (
    <div 
      className={`${styles.coinCard} ${isSelected ? styles.selected : ''}`}
      onClick={onSelect}
    >
      {/* Header with rank and watchlist */}
      <div className={styles.cardHeader}>
        <span className={styles.rank}>#{market_cap_rank || rank}</span>
        <button
          className={`${styles.watchlistBtn} ${isInWatchlist ? styles.inWatchlist : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist();
          }}
          aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          {isInWatchlist ? '★' : '☆'}
        </button>
      </div>

      {/* Coin Info */}
      <div className={styles.coinInfo}>
        <img 
          src={image} 
          alt={`${name} logo`} 
          className={styles.coinImage}
          loading="lazy"
        />
        <div className={styles.coinDetails}>
          <h3 className={styles.coinName}>{name}</h3>
          <span className={styles.coinSymbol}>{symbol.toUpperCase()}</span>
        </div>
      </div>

      {/* Price */}
      <div className={styles.priceSection}>
        <div className={styles.currentPrice}>
          {formatCurrency(current_price)}
        </div>
        <div className={styles.priceChanges}>
          <span className={`${styles.priceChange} ${isPositive24h ? styles.positive : styles.negative}`}>
            {formatPercentage(priceChange24h)} 24h
          </span>
          <span className={`${styles.priceChange} ${isPositive7d ? styles.positive : styles.negative}`}>
            {formatPercentage(priceChange7d)} 7d
          </span>
        </div>
      </div>

      {/* Market Data */}
      <div className={styles.marketData}>
        <div className={styles.dataItem}>
          <span className={styles.dataLabel}>Market Cap</span>
          <span className={styles.dataValue}>{formatCurrency(market_cap, 0)}</span>
        </div>
        <div className={styles.dataItem}>
          <span className={styles.dataLabel}>Volume (24h)</span>
          <span className={styles.dataValue}>{formatCurrency(total_volume, 0)}</span>
        </div>
        <div className={styles.dataItem}>
          <span className={styles.dataLabel}>24h Range</span>
          <span className={styles.dataValue}>
            {formatCurrency(low_24h)} - {formatCurrency(high_24h)}
          </span>
        </div>
      </div>

      {/* Click indicator */}
      <div className={styles.clickIndicator}>
        Click for chart {isSelected ? '▼' : '▶'}
      </div>
    </div>
  );
};

CoinCard.propTypes = {
  coin: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    current_price: PropTypes.number.isRequired,
    market_cap: PropTypes.number.isRequired,
    market_cap_rank: PropTypes.number,
    price_change_percentage_24h: PropTypes.number,
    price_change_percentage_7d: PropTypes.number,
    total_volume: PropTypes.number,
    high_24h: PropTypes.number,
    low_24h: PropTypes.number,
  }).isRequired,
  rank: PropTypes.number,
  isInWatchlist: PropTypes.bool.isRequired,
  onToggleWatchlist: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

export default CoinCard;