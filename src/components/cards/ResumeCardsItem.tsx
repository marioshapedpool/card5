import clsx from 'clsx';
import { CreditCard, Gauge, ReceiptText } from 'lucide-react';

type GradientColor = 'indigo' | 'emerald' | 'amber';
type IconName = 'CreditCard' | 'Gauge' | 'ReceiptText';

interface ResumeCardsItemProps {
  value: number | string;
  textInfo: string;
  color: GradientColor;
  icon: IconName;
}

export default function ResumeCardsItem({
  value,
  textInfo,
  color,
  icon,
}: ResumeCardsItemProps) {
  const IconComponent = {
    CreditCard: CreditCard,
    Gauge: Gauge,
    ReceiptText: ReceiptText,
  }[icon];

  const cardClasses = clsx(
    'relative overflow-hidden rounded-2xl p-6 shadow-sm border transition-all duration-200 hover:shadow-md',
    {
      'bg-indigo-50 border-indigo-200': color === 'indigo',
      'bg-emerald-50 border-emerald-200': color === 'emerald',
      'bg-amber-50 border-amber-200': color === 'amber',
    }
  );

  const iconContainerClasses = clsx(
    'w-12 h-12 rounded-lg flex items-center justify-center',
    {
      'bg-indigo-100': color === 'indigo',
      'bg-emerald-100': color === 'emerald',
      'bg-amber-100': color === 'amber',
    }
  );

  const iconClasses = clsx('h-6 w-6', {
    'text-indigo-600': color === 'indigo',
    'text-emerald-600': color === 'emerald',
    'text-amber-600': color === 'amber',
  });

  const valueClasses = clsx('text-slate-900', {
    'text-3xl': typeof value === 'number',
    'text-4xl': typeof value === 'string',
  });

  const formattedValue =
    typeof value === 'number' ? `$${value.toLocaleString()}` : value;

  return (
    <div className={cardClasses}>
      <div className="flex items-start justify-between mb-4">
        <div className={iconContainerClasses}>
          {IconComponent && <IconComponent className={iconClasses} />}
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-600">{textInfo}</p>
        <p className={clsx(valueClasses, 'font-bold')}>{formattedValue}</p>
      </div>

      {/* Decorative element */}
      <div
        className={clsx(
          'absolute -bottom-2 -right-2 w-24 h-24 rounded-full blur-2xl opacity-10',
          {
            'bg-indigo-500': color === 'indigo',
            'bg-emerald-500': color === 'emerald',
            'bg-amber-500': color === 'amber',
          }
        )}
      />
    </div>
  );
}
