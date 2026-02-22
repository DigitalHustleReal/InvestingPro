'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { CHART_COLORS, CHART_COLORS_ALPHA, CHARTJS_TOOLTIP_DEFAULTS, CHARTJS_GRID_COLOR } from '@/lib/charts/theme';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SIPReturnsChartProps {
  data: Array<{ year: string; invested: number; value: number }>;
}

/**
 * SIP Returns Comparison Chart
 * Shows invested amount vs current value over time
 */
export function SIPReturnsChart({ data }: SIPReturnsChartProps) {
  const chartData = {
    labels: data.map(d => d.year),
    datasets: [
      {
        label: 'Amount Invested',
        data: data.map(d => d.invested),
        backgroundColor: CHART_COLORS_ALPHA.negative,
        borderColor: CHART_COLORS.negative,
        borderWidth: 1,
      },
      {
        label: 'Current Value',
        data: data.map(d => d.value),
        backgroundColor: CHART_COLORS_ALPHA.positive,
        borderColor: CHART_COLORS.positive,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 15,
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: 'SIP Investment Growth',
        font: { size: 16, weight: 'bold' as const },
      },
      tooltip: {
        ...CHARTJS_TOOLTIP_DEFAULTS,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ₹${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: CHARTJS_GRID_COLOR },
        ticks: {
          callback: function(value: any) {
            return '₹' + (value / 1000) + 'K';
          }
        }
      },
    },
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
