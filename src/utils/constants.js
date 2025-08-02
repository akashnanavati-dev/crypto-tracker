export const API_ENDPOINTS = {
  MARKETS: '/coins/markets',
  COIN_DETAIL: '/coins',
  MARKET_CHART: '/coins/{id}/market_chart',
  SEARCH: '/search',
};

export const TIME_RANGES = {
  '1': { label: '24H', days: 1 },
  '7': { label: '7D', days: 7 },
  '30': { label: '30D', days: 30 },
  '90': { label: '3M', days: 90 },
    '365': { label: '1Y', days: 365 },
};

export const SORT_OPTIONS = [
  { value: 'market_cap_desc', label: 'Market Cap (High to Low)' },
  { value: 'market_cap_asc', label: 'Market Cap (Low to High)' },
  { value: 'price_desc', label: 'Price (High to Low)' },
  { value: 'price_asc', label: 'Price (Low to High)' },
  { value: 'percent_change_24h_desc', label: '24h Change (High to Low)' },
  { value: 'percent_change_24h_asc', label: '24h Change (Low to High)' },
];

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
};

export const LOCAL_STORAGE_KEYS = {
  WATCHLIST: 'crypto-watchlist',
  THEME: 'crypto-theme',
  SETTINGS: 'crypto-settings',
};