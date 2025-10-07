import { useState } from 'react';
import { useCardStore } from '../store/card';
import { CardForm } from '../components/cards/CardForm';
import { CardList } from '../components/cards/CardList';
import CreditCardCalendar from '../components/calendars/CreditCardCalendar';
import { PlusCircle, X } from 'lucide-react';
import ResumeCards from '../components/cards/ResumeCards';
import Footer from '../components/Footer';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useTranslation } from '../i18n/useTranslation';
import clsx from 'clsx';
import { useCardPersistence } from '../hooks/useCardPersistence';

export default function Dashboard() {
  const { t } = useTranslation();
  const { cards } = useCardStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { handleAddCard, handleRemoveCard, handleUpdateCard } =
    useCardPersistence();

  const totalCreditLine = cards.reduce(
    (sum, card) => sum + card.credit_line,
    0
  );
  const totalCurrentBalance = cards.reduce(
    (sum, card) => sum + card.current_balance,
    0
  );

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {t('dashboard.title', 'dashboard')}
              </h1>
              <p className="text-slate-600 mt-1">
                {t('dashboard.subtitle', 'dashboard')}
              </p>
            </div>

            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className={clsx(
                'flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm',
                isFormOpen
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              )}
            >
              {!isFormOpen ? (
                <>
                  <PlusCircle className="h-5 w-5" />
                  <span>{t('dashboard.newCardButton', 'dashboard')}</span>
                </>
              ) : (
                <>
                  <X className="h-5 w-5" />
                  <span>{t('dashboard.closeButton', 'dashboard')}</span>
                </>
              )}
            </button>
          </div>
        </header>

        {isFormOpen && (
          <section className="mb-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-slide-down">
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-indigo-600" />
                {t('dashboard.newCardFormTitle', 'dashboard')}
              </h2>
            </div>
            <div className="p-6">
              <CardForm
                onAddCard={async (newCard) => {
                  const success = await handleAddCard(newCard);
                  if (success) {
                    setIsFormOpen(false);
                  }
                  return success;
                }}
              />
            </div>
          </section>
        )}

        <section className="mb-8">
          <ResumeCards
            cardsLength={cards.length}
            totalCreditLine={totalCreditLine}
            totalCurrentBalance={totalCurrentBalance}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            {t('dashboard.myCardsTitle', 'dashboard')}
          </h2>
          <CardList
            cards={cards}
            onUpdateCard={handleUpdateCard}
            onRemoveCard={handleRemoveCard}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold">
            {t('dashboard.calendarTitle', 'dashboard')}
          </h2>
          <div className="bg-white rounded-2xl ">
            <CreditCardCalendar cards={cards} />
          </div>
        </section>

        <section className="mb-8">
          <DashboardLayout cards={cards} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
