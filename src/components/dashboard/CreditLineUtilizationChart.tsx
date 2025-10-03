import React from 'react';
import { type Card } from '../../types/card';
import { useTranslation } from '../../i18n/useTranslation';

interface CreditLineUtilizationChartProps {
  cards: Card[];
}

const CreditLineUtilizationChart: React.FC<CreditLineUtilizationChartProps> = ({
  cards,
}) => {
  const { t } = useTranslation();
  const totalCreditLine = cards.reduce(
    (sum, card) => sum + card.credit_line,
    0
  );
  const totalCurrentBalance = cards.reduce(
    (sum, card) => sum + card.current_balance,
    0
  );

  const utilizationPercentage =
    totalCreditLine > 0 ? (totalCurrentBalance / totalCreditLine) * 100 : 0;

  const hasData = totalCreditLine > 0;

  // SVG circle properties
  const size = 200;
  const strokeWidth = 20;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (utilizationPercentage / 100) * circumference;

  // Determine color based on utilization
  const getUtilizationColor = (percentage: number) => {
    if (percentage < 30) return '#10b981'; // green
    if (percentage < 70) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const utilizationColor = getUtilizationColor(utilizationPercentage);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 tracking-tight">
          {t('credit-utilization-chart.title', 'charts')}
        </h3>
        {!hasData && (
          <p className="text-sm text-gray-500">
            {t('credit-utilization-chart.no-data', 'charts')}
          </p>
        )}
      </div>

      {hasData && (
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth={strokeWidth}
              />
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={utilizationColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-gray-800">
                {utilizationPercentage.toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 mt-1">
                {t('credit-utilization-chart.used', 'charts')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditLineUtilizationChart;
