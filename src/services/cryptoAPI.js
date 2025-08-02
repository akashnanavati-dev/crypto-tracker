// cryptoAPI.js

// Get the API key from the .env file
const API_KEY = process.env.REACT_APP_COINGECKO_API_KEY;

// This constant correctly uses the proxy for development
// and the full URL for production builds
const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? '' // Use proxy in development
  : 'https://api.coingecko.com/api/v3';

/**
 * Generic API request handler with error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} API response data
 */
const apiRequest = async (endpoint, options = {}) => {
  // Add the API key to the endpoint as a query parameter
  const keyParam = `x_cg_demo_api_key=${API_KEY}`;
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${API_BASE_URL}${endpoint}${separator}${keyParam}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request failed:', error);
    throw new Error(`API request failed: ${error.message}`);
  }
};

/**
 * Get cryptocurrency market data
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} Array of cryptocurrency data
 */
export const getCryptoMarkets = async (params = {}) => {
  const queryParams = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: 50,
    page: 1,
    sparkline: false,
    price_change_percentage: '1h,24h,7d',
    ...params,
  });

  return apiRequest(`/coins/markets?${queryParams}`);
};

/**
 * Get detailed information about a specific coin
 * @param {string} coinId - Coin ID
 * @returns {Promise<Object>} Detailed coin data
 */
export const getCoinById = async (coinId) => {
  return apiRequest(`/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`);
};

/**
 * Get historical market data for a coin
 * @param {string} coinId - Coin ID
 * @param {string} days - Number of days (1, 7, 14, 30, 90, 180, 365, max)
 * @param {string} vsCurrency - Target currency (default: usd)
 * @returns {Promise<Object>} Historical price data
 */
export const getCoinHistory = async (coinId, days = '7', vsCurrency = 'usd') => {
  return apiRequest(`/coins/${coinId}/market_chart?vs_currency=${vsCurrency}&days=${days}`);
};

/**
 * Search for cryptocurrencies
 * @param {string} query - Search query
 * @returns {Promise<Object>} Search results
 */
export const searchCoins = async (query) => {
  return apiRequest(`/search?query=${encodeURIComponent(query)}`);
};