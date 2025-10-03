import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { type Card } from '../../types/card';
import { useTranslation } from '../../i18n/useTranslation';

interface CardBalanceBreakdownChartProps {
  cards: Card[];
}

const CardBalanceBreakdownChart: React.FC<CardBalanceBreakdownChartProps> = ({
  cards,
}) => {
  const { t } = useTranslation();
  const data = cards
    .filter((card) => card.current_balance > 0)
    .sort((a, b) => b.current_balance - a.current_balance)
    .map((card) => ({
      name: card.alias,
      bank: card.bank,
      fullName: `${card.alias} (${card.bank})`,
      value: card.current_balance,
    }));

  const totalBalance = data.reduce((sum, item) => sum + item.value, 0);

  const colors = [
    '#1E3A8A', // Azul marino
    '#2563EB', // Azul
    '#3B82F6', // Azul claro
    '#60A5FA', // Azul más claro
    '#93C5FD', // Azul pastel
  ];

  const hasData = data.length > 0;

  if (!hasData) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md w-full transition-all duration-300 ease-in-out">
        <h3 className="text-lg font-semibold text-gray-800 tracking-tight mb-4">
          {t('card-balance.title', 'charts')}
        </h3>
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-gray-500">
            {t('card-balance.no-balance', 'charts')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-full transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 tracking-tight">
          {t('card-balance.title', 'charts')}
        </h3>
        <div className="text-right">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-bold text-gray-800">
            ${totalBalance.toLocaleString('es-MX')}
          </p>
        </div>
      </div>

      <ResponsiveContainer
        width="100%"
        height={Math.max(300, data.length * 60)}
      >
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 10, right: 30, bottom: 10, left: 10 }}
          barGap={8}
        >
          <CartesianGrid
            strokeDasharray="5 5"
            stroke="#e5e7eb"
            vertical={false}
          />
          <XAxis
            type="number"
            tickFormatter={(value) => `$${value.toLocaleString('es-MX')}`}
            axisLine={false}
            tickLine={false}
            stroke="#9ca3af"
            fontSize={12}
            className="text-xs font-medium"
          />
          <YAxis
            dataKey="fullName"
            type="category"
            axisLine={false}
            tickLine={false}
            width={120}
            stroke="#4b5563"
            fontSize={12}
            className="text-sm font-medium"
            tick={(props) => {
              const { x, y, payload } = props;
              const item = data.find((d) => d.fullName === payload.value);
              return (
                <g transform={`translate(${x},${y})`}>
                  <text
                    x={0}
                    y={-6}
                    textAnchor="end"
                    fill="#1f2937"
                    fontSize={13}
                    fontWeight="600"
                  >
                    {item?.name}
                  </text>
                  <text
                    x={0}
                    y={8}
                    textAnchor="end"
                    fill="#6b7280"
                    fontSize={11}
                  >
                    {item?.bank}
                  </text>
                </g>
              );
            }}
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
            formatter={(value: number) => [
              `$${value.toLocaleString('es-MX')}`,
              'Balance',
            ]}
            labelFormatter={(label) => label}
          />
          <Bar
            dataKey="value"
            radius={[4, 4, 4, 4]}
            barSize={28}
            className="transition-all duration-300 ease-in-out"
          >
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                className="hover:opacity-80 transition-opacity duration-200"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CardBalanceBreakdownChart;
