import React, { useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import Watchlist from './components/Watchlist/Watchlist';
import PriceChart from './components/Chart/PriceChart';
import SearchBar from './components/SearchBar/SearchBar';
import { useLocalStorage } from './hooks/useLocalStorage';

// Correct imports for the refactored CSS
import './styles/global.css';
import './styles/themes.css';
import './App.css'; // Assuming this file now contains only layout/header-specific styles

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [watchlist, setWatchlist] = useLocalStorage('crypto-watchlist', []);
  const [theme, setTheme] = useLocalStorage('crypto-theme', 'dark');
  const [selectedCoin, setSelectedCoin] = useState(null);

  const handleCoinSelect = (coin) => {
    setSelectedCoin(selectedCoin?.id === coin.id ? null : coin);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const addToWatchlist = (coin) => {
    if (!watchlist.find(item => item.id === coin.id)) {
      setWatchlist([...watchlist, coin]);
    }
  };

  const removeFromWatchlist = (coinId) => {
    setWatchlist(watchlist.filter(coin => coin.id !== coinId));
  };

  return (
    <div className={`app ${theme}`} data-theme={theme}>
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🚀 Crypto Tracker</h1>
          <div className="header-controls">
            <SearchBar onCoinSelect={handleCoinSelect} />
            <button 
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
        <nav className="tab-navigation">
          <button 
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`tab ${activeTab === 'watchlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('watchlist')}
          >
            ⭐ Watchlist ({watchlist.length})
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'dashboard' && (
          <Dashboard 
            watchlist={watchlist}
            onAddToWatchlist={addToWatchlist}
            onRemoveFromWatchlist={removeFromWatchlist}
            selectedCoin={selectedCoin}
            onCoinSelect={handleCoinSelect}
          />
        )}
        {activeTab === 'watchlist' && (
          <Watchlist 
            watchlist={watchlist}
            onRemoveFromWatchlist={removeFromWatchlist}
            onSelectCoin={handleCoinSelect}
            selectedCoin={selectedCoin}
          />
        )}
      </main>

      {selectedCoin && (
        <div className="chart-overlay">
          <div className="chart-container">
            <div className="chart-header">
              <h3>{selectedCoin.name} ({selectedCoin.symbol.toUpperCase()}) Price Chart</h3>
              <button 
                onClick={() => handleCoinSelect(null)} 
                className="close-chart-button"
              >
                ✕
              </button>
            </div>
            <PriceChart coinId={selectedCoin.id} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;