'use client';

import { Line } from 'react-chartjs-2';
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
import { CHART_COLORS, CHART_COLORS_ALPHA, CHARTJS_TOOLTIP_DEFAULTS, CHARTJS_GRID_COLOR } from '@/lib/charts/theme';

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

interface StockPriceChartProps {
  data: Array<{ date: string; price: number }>;
  symbol: string;
}

/**
 * Stock Price Line Chart
 * Shows historical stock price movement
 */
export function StockPriceChart({ data, symbol }: StockPriceChartProps) {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: `${symbol} Price`,
        data: data.map(d => d.price),
        borderColor: CHART_COLORS.primary,
        backgroundColor: CHART_COLORS_ALPHA.primary,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `${symbol} Price History`,
        font: { size: 16, weight: 'bold' as const },
      },
      tooltip: {
        ...CHARTJS_TOOLTIP_DEFAULTS,
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            return `₹${context.parsed.y.toFixed(2)}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxTicksLimit: 8 },
      },
      y: {
        grid: { color: CHARTJS_GRID_COLOR },
        ticks: {
          callback: function(value: any) {
            return '₹' + value.toLocaleString();
          }
        }
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
