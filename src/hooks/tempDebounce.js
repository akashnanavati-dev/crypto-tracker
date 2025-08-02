import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (or on unmount)
    // This is how we prevent the API call from being made too frequently
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run effect if value or delay changes

  return debouncedValue;
}

export default useDebounce;