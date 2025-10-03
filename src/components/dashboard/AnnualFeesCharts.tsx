import React from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { type Card } from '../../types/card';
interface AnnualFeesChartProps {
  cards: Card[];
}
const AnnualFeesChart: React.FC<AnnualFeesChartProps> = ({ cards }) => {
  const { t } = useTranslation();
  const data = cards
    .filter((card) => card.annual_fee > 0)
    .map((card) => ({
      name: `${card.alias} (${card.bank})`,
      shortname: `${card.alias}`,
      value: card.annual_fee,
    }));
  const hasData = data.length > 0;
  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-full transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 tracking-tight">
          {t('annual-fees-chart.title', 'charts')}
        </h3>
        {!hasData && (
          <p className="text-sm text-gray-500">
            {t(
              'annual-fees-chart.no-data',
              'No annual fees recorded to display.'
            )}
          </p>
        )}
      </div>
      {hasData && (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, bottom: 60, left: 10 }}
            barGap={8}
          >
            <CartesianGrid
              strokeDasharray="5 5"
              stroke="#e5e7eb"
              horizontal={false}
            />
            <XAxis
              dataKey="shortname"
              axisLine={false}
              tickLine={false}
              stroke="#4b5563"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={100}
              className="text-sm font-medium"
            />
            <YAxis
              type="number"
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              axisLine={false}
              tickLine={false}
              stroke="#9ca3af"
              fontSize={12}
              className="text-xs font-medium"
            />
            <Tooltip
              cursor={{ fill: 'rgba(30, 58, 138, 0.05)' }}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                backgroundColor: '#ffffff',
                boxShadow:
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                fontSize: '0.875rem',
                padding: '10px',
              }}
              formatter={(value: number) => `$${value.toLocaleString()}`}
              labelFormatter={(label) => label}
            />
            <Bar
              dataKey="value"
              fill="#1E3A8A"
              radius={[4, 4, 0, 0]}
              barSize={25}
              className="transition-all duration-300 ease-in-out hover:fill-blue-700"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
export default AnnualFeesChart;
