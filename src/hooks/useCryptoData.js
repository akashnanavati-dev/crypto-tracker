import { useState, useEffect, useCallback } from 'react';
import { getCryptoMarkets, getCoinById } from '../services/cryptoAPI';

/**
 * Custom hook for fetching cryptocurrency data
 * @param {Object} config - Configuration object
 * @param {string} config.endpoint - API endpoint ('markets', 'coin')
 * @param {Object} config.params - Query parameters
 * @param {number} config.refreshInterval - Auto-refresh interval in ms
 * @returns {Object} { data, loading, error, refetch }
 */
export const useCryptoData = ({ 
  endpoint, 
  params = {}, 
  refreshInterval = null 
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      let result;

      switch (endpoint) {
        case 'markets':
          result = await getCryptoMarkets(params);
          break;
        case 'coin':
          result = await getCoinById(params.id);
          break;
        default:
          throw new Error(`Unknown endpoint: ${endpoint}`);
      }

      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Crypto API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, params]); // <-- Fixed dependency array

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh setup
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};