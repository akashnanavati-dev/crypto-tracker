// cryptoAPI.js

// Get the API key from the .env file
const API_KEY = process.env.REACT_APP_COINGECKO_API_KEY;

// API_BASE_URL is now simplified as we'll use a specific proxy path in development
const API_BASE_URL = '/api';

/**
 * Generic API request handler with error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} API response data
 */
const apiRequest = async (endpoint, options = {}) => {
  // Construct the URL using the proxy base path
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Create a headers object and add the API key and User-Agent
  const headers = {
    'Content-Type': 'application/json',
    'x-cg-demo-api-key': API_KEY,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    ...options.headers,
  };

  console.log('Sending API Request:', { url, headers });

  try {
    const response = await fetch(url, {
      headers: headers,
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

  return apiRequest(`/coins/markets?${queryParams.toString()}`);
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
