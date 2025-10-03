import ResumeCardsItem from './ResumeCardsItem';
import { useTranslation } from '../../i18n/useTranslation';

interface ResumeCardsProps {
  cardsLength: number;
  totalCreditLine: number;
  totalCurrentBalance: number;
}

export default function ResumeCards({
  cardsLength,
  totalCreditLine,
  totalCurrentBalance,
}: ResumeCardsProps) {
  const { t } = useTranslation();

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
      <ResumeCardsItem
        color="indigo"
        icon="CreditCard"
        textInfo={t('resumecard.totalCards', 'dashboard')}
        value={cardsLength.toString()}
      />
      <ResumeCardsItem
        color="emerald"
        icon="Gauge"
        textInfo={t('resumecard.totalCreditLine', 'dashboard')}
        value={totalCreditLine}
      />
      <ResumeCardsItem
        color="amber"
        icon="ReceiptText"
        textInfo={t('resumecard.totalBalance', 'dashboard')}
        value={totalCurrentBalance}
      />
    </section>
  );
}
