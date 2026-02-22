'use client';

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { CHART_PALETTE, CHARTJS_TOOLTIP_DEFAULTS } from '@/lib/charts/theme';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PortfolioAllocationChartProps {
  holdings: Array<{ name: string; value: number; color?: string }>;
}

/**
 * Portfolio Allocation Doughnut Chart
 * Shows portfolio distribution by holdings
 */
export function PortfolioAllocationChart({ holdings }: PortfolioAllocationChartProps) {
  const chartData = {
    labels: holdings.map(h => h.name),
    datasets: [
      {
        data: holdings.map(h => h.value),
        // Prefer per-holding override colour, then cycle through brand palette
        backgroundColor: holdings.map((h, i) => h.color || CHART_PALETTE[i % CHART_PALETTE.length]),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          padding: 15,
          font: { size: 12 },
          generateLabels: function(chart: any) {
            const data = chart.data;
            const total = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
            return data.labels.map((label: string, i: number) => {
              const value = data.datasets[0].data[i];
              const percentage = ((value / total) * 100).toFixed(1);
              return {
                text: `${label} (${percentage}%)`,
                fillStyle: data.datasets[0].backgroundColor[i],
                hidden: false,
                index: i,
              };
            });
          }
        },
      },
      tooltip: {
        ...CHARTJS_TOOLTIP_DEFAULTS,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
          }
        }
      },
    },
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
