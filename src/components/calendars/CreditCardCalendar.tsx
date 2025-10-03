import React, { useMemo, useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import type { View } from 'react-big-calendar';
import moment from 'moment';
import clsx from 'clsx';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
} from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/CreditCardCalendar.css';
import type { Card } from '../../types/card';
import { useTranslation } from '../../i18n/useTranslation';

const localizer = momentLocalizer(moment);

interface CreditCardCalendarProps {
  cards: Card[];
}

const isWeekend = (date: moment.Moment): boolean => {
  const dayOfWeek = date.day();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

const generateCardCycleEvents = (
  card: Card,
  numFutureMonths: number = 6,
  t: any
): any[] => {
  const cardEvents: any[] = [];
  const initialCutOffMoment = moment(card.cut_off_date);
  const initialPaymentDeadlineMoment = moment(card.payment_deadline);

  const cutOffDayOfMonth = initialCutOffMoment.date();
  const paymentGraceDays = initialPaymentDeadlineMoment.diff(
    initialCutOffMoment,
    'days'
  );

  let annualFeeDayOfMonth: number | undefined;
  if (card.annual_fee_deadline) {
    annualFeeDayOfMonth = moment(card.annual_fee_deadline).date();
  }

  let currentGenerationMonth = moment().startOf('month');

  for (let i = 0; i < numFutureMonths + 1; i++) {
    const monthToGenerate = currentGenerationMonth.clone().add(i, 'months');

    let currentCutOffMoment = monthToGenerate.clone().date(cutOffDayOfMonth);
    if (currentCutOffMoment.date() !== cutOffDayOfMonth) {
      currentCutOffMoment = currentCutOffMoment.endOf('month');
    }

    let currentPaymentDeadlineMoment = currentCutOffMoment
      .clone()
      .add(paymentGraceDays, 'days');

    while (isWeekend(currentPaymentDeadlineMoment)) {
      currentPaymentDeadlineMoment.add(1, 'day');
    }

    cardEvents.push({
      id: `${card.id}-cut-off-${currentCutOffMoment.format('YYYYMMDD')}`,
      title: `${t('calendar.cutOff', 'dashboard')}: ${card.alias}`,
      start: currentCutOffMoment.toDate(),
      end: currentCutOffMoment.toDate(),
      allDay: true,
      resource: { cardId: card.id, type: 'cut-off' },
    });

    cardEvents.push({
      id: `${card.id}-payment-deadline-${currentPaymentDeadlineMoment.format(
        'YYYYMMDD'
      )}`,
      title: `${t('calendar.payment', 'dashboard')}: ${card.alias}`,
      start: currentPaymentDeadlineMoment.toDate(),
      end: currentPaymentDeadlineMoment.toDate(),
      allDay: true,
      resource: { cardId: card.id, type: 'payment-deadline' },
    });

    if (card.annual_fee_deadline && annualFeeDayOfMonth !== undefined) {
      const originalAnnualFeeMoment = moment(card.annual_fee_deadline);
      if (monthToGenerate.month() === originalAnnualFeeMoment.month()) {
        let currentAnnualFeeMoment = monthToGenerate
          .clone()
          .date(annualFeeDayOfMonth);

        if (currentAnnualFeeMoment.date() !== annualFeeDayOfMonth) {
          currentAnnualFeeMoment = currentAnnualFeeMoment.endOf('month');
        }

        cardEvents.push({
          id: `${card.id}-annual-fee-${currentAnnualFeeMoment.format(
            'YYYYMMDD'
          )}`,
          title: `${t('calendar.annualFee')}: ${card.alias}`,
          start: currentAnnualFeeMoment.toDate(),
          end: currentAnnualFeeMoment.toDate(),
          allDay: true,
          resource: {
            cardId: card.id,
            type: 'annual-fee',
            colorClass: 'bg-slate-500',
          },
        });
      }
    }
  }

  return cardEvents;
};

const SuperCreditCardCalendar: React.FC<CreditCardCalendarProps> = ({
  cards,
}) => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>('month');

  const cardColors = useMemo(() => {
    const colors: { [key: string]: string } = {};
    const colorPalette = [
      'bg-rose-500',
      'bg-blue-500',
      'bg-emerald-500',
      'bg-purple-500',
      'bg-amber-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500',
    ];
    cards.forEach((card, index) => {
      colors[card.id] = colorPalette[index % colorPalette.length];
    });
    return colors;
  }, [cards]);

  const allCalendarEvents = useMemo(() => {
    const generatedEvents: any[] = [];
    cards.forEach((card) => {
      const cardSpecificEvents = generateCardCycleEvents(card, 6, t);
      generatedEvents.push(...cardSpecificEvents);
    });

    return generatedEvents.map((event) => ({
      ...event,
      resource: {
        ...event.resource,
        colorClass:
          event.resource.type === 'annual-fee'
            ? 'bg-slate-500'
            : cardColors[event.resource.cardId],
      },
    }));
  }, [cards, cardColors, t]);

  const EventComponent = ({ event }: { event: any }) => {
    const { title, resource } = event;
    const { colorClass, type } = resource;

    const getIcon = () => {
      switch (type) {
        case 'cut-off':
          return <CreditCard className="w-3 h-3" />;
        case 'payment-deadline':
          return <Clock className="w-3 h-3" />;
        case 'annual-fee':
          return <CalendarIcon className="w-3 h-3" />;
        default:
          return <div className={`w-3 h-3 rounded-full ${colorClass}`} />;
      }
    };

    return (
      <div className="flex items-center space-x-2 p-1 rounded-md bg-white/90 backdrop-blur-sm shadow-sm border border-gray-100">
        <div
          className={clsx(
            'flex items-center justify-center p-1 rounded-full text-white',
            colorClass
          )}
        >
          {getIcon()}
        </div>
        <span className="text-xs font-medium text-gray-800 truncate">
          {title}
        </span>
      </div>
    );
  };

  const CustomToolbar = (toolbar: any) => {
    const goToBack = useCallback(() => {
      const newDate = moment(toolbar.date)
        .subtract(
          1,
          toolbar.view === 'month'
            ? 'month'
            : toolbar.view === 'week'
            ? 'week'
            : 'day'
        )
        .toDate();
      setCurrentDate(newDate);
    }, [toolbar.date, toolbar.view]);

    const goToNext = useCallback(() => {
      const newDate = moment(toolbar.date)
        .add(
          1,
          toolbar.view === 'month'
            ? 'month'
            : toolbar.view === 'week'
            ? 'week'
            : 'day'
        )
        .toDate();
      setCurrentDate(newDate);
    }, [toolbar.date, toolbar.view]);

    const goToToday = useCallback(() => {
      setCurrentDate(new Date());
    }, []);

    const handleViewChange = useCallback(
      (view: View) => {
        setCurrentView(view);
        toolbar.onView(view);
      },
      [toolbar.onView]
    );

    const viewNames = toolbar.views;
    const viewLabels = {
      month: t('calendar.month', 'dashboard'),
      week: t('calendar.week', 'dashboard'),
      day: t('calendar.day', 'dashboard'),
      agenda: t('calendar.agenda', 'dashboard'),
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100  mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Navigation */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={goToToday}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              {t('calendar.today', 'dashboard')}
            </button>
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-white transition-colors duration-200"
                onClick={goToBack}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-white transition-colors duration-200"
                onClick={goToNext}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Label */}
          <div className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
            {toolbar.label}
          </div>

          {/* Views */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {viewNames.map((view: string) => (
              <button
                key={view}
                type="button"
                className={clsx(
                  'px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  currentView === view
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                )}
                onClick={() => handleViewChange(view as View)}
              >
                {viewLabels[view as keyof typeof viewLabels]}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const messages = {
    next: t('calendar.next', 'dashboard'),
    previous: t('calendar.previous', 'dashboard'),
    today: t('calendar.today', 'dashboard'),
    month: t('calendar.month', 'dashboard'),
    week: t('calendar.week', 'dashboard'),
    day: t('calendar.day', 'dashboard'),
    agenda: t('calendar.agenda', 'dashboard'),
    date: t('calendar.date', 'dashboard'),
    time: t('calendar.time', 'dashboard'),
    event: t('calendar.event', 'dashboard'),
    noEventsInRange: t('calendar.noEventsInRange'),

  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="h-[700px] rounded-xl overflow-hidden">
              <Calendar
                localizer={localizer}
                events={allCalendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                views={['month', 'week', 'day']}
                defaultView="month"
                date={currentDate}
                view={currentView}
                onNavigate={setCurrentDate}
                onView={setCurrentView}
                messages={messages}
                components={{
                  event: EventComponent,
                  toolbar: CustomToolbar,
                }}
                className="custom-calendar"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperCreditCardCalendar;
