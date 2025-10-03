import AnnualFeesChart from './AnnualFeesCharts';
import CreditLineUtilizationChart from './CreditLineUtilizationChart';
import CardBalanceBreakdownChart from './CardBalanceBreakdownChart';
import type { Card } from '../../types/card';

interface DashboardProps {
  cards: Card[];
}

export default function DashboardLayout({ cards }: DashboardProps) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnnualFeesChart cards={cards} />

        <CreditLineUtilizationChart cards={cards} />

        <CardBalanceBreakdownChart cards={cards} />
      </div>
    </section>
  );
}
