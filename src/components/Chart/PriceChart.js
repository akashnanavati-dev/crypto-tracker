import React, { useEffect, useState, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getCoinHistory } from '../../services/cryptoAPI';
import { formatCurrency } from '../../utils/formatters';
import styles from './PriceChart.module.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PriceChart = ({ coinId }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7');

  const fetchChartData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getCoinHistory(coinId, timeRange);
      
      if (!data || !data.prices) {
        throw new Error('No chart data available');
      }

      const prices = data.prices.map(price => ({
        x: new Date(price[0]).toLocaleDateString(),
        y: price[1]
      }));

      setChartData({
        labels: prices.map(p => p.x),
        datasets: [
          {
            label: 'Price (USD)',
            data: prices.map(p => p.y),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.1,
            pointRadius: 0,
            pointHoverRadius: 6,
          }
        ]
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [coinId, timeRange]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label(context) { // <-- Shorthand fix
            return `Price: ${formatCurrency(context.parsed.y)}`;
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 7,
        }
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          callback(value) { // <-- Shorthand fix
            return formatCurrency(value);
          }
        }
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  if (loading) {
    return (
      <div className={styles.chartContainer}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.chartContainer}>
        <div className={styles.error}>
          <p>Failed to load chart: {error}</p>
          <button onClick={fetchChartData} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      {/* Time Range Selector */}
      <div className={styles.timeRangeSelector}>
        {[
          { value: '1', label: '24H' },
          { value: '7', label: '7D' },
          { value: '30', label: '30D' },
          { value: '90', label: '3M' },
          { value: '365', label: '1Y' }
        ].map(({ value, label }) => (
          <button
            key={value}
            className={`${styles.timeButton} ${timeRange === value ? styles.active : ''}`}
            onClick={() => setTimeRange(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className={styles.chartWrapper}>
        {chartData && <Line data={chartData} options={chartOptions} />}
      </div>
    </div>
  );
};

export default PriceChart;