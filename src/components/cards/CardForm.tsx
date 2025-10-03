import React, { useState } from 'react';
import type { Card } from '../../types/card';
import clsx from 'clsx';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

interface CardFormProps {
  onAddCard: (
    card: Omit<Card, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => Promise<boolean>;
  onClose?: () => void;
}

export function CardForm({ onAddCard, onClose }: CardFormProps) {
  const { t } = useTranslation();

  const [alias, setAlias] = useState('');
  const [bank, setBank] = useState('');
  const [lastFourDigits, setLastFourDigits] = useState('');
  const [cutOffDate, setCutOffDate] = useState('');
  const [paymentDeadline, setPaymentDeadline] = useState('');
  const [network, setNetwork] = useState('');
  const [annualFee, setAnnualFee] = useState('');
  const [annualFeeDeadline, setAnnualFeeDeadline] = useState('');
  const [creditLine, setCreditLine] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');
  const [description, setDescription] = useState('');
  const [benefits, setBenefits] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');

  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setAlias('');
    setBank('');
    setLastFourDigits('');
    setCutOffDate('');
    setPaymentDeadline('');
    setNetwork('');
    setAnnualFee('');
    setAnnualFeeDeadline('');
    setCreditLine('');
    setCurrentBalance('');
    setDescription('');
    setBenefits('');
    setExpiryMonth('');
    setExpiryYear('');
    setStatusMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setStatusMsg(null);

      if (!alias.trim() || !bank.trim()) {
        setStatusMsg(t('cardform.errorAliasBank', 'dashboard'));
        return;
      }
      if (!cutOffDate || !paymentDeadline) {
        setStatusMsg(t('cardform.errorDates', 'dashboard'));
        return;
      }
      if (!expiryMonth || !expiryYear) {
        setStatusMsg(t('cardform.errorExpiry', 'dashboard'));
        return;
      }

      const success = await onAddCard({
        alias: alias.trim(),
        bank: bank.trim(),
        last_four_digits: Number(lastFourDigits),
        cut_off_date: new Date(cutOffDate),
        payment_deadline: new Date(paymentDeadline),
        network: network.trim(),
        annual_fee: annualFee ? Number(annualFee) : 0,
        annual_fee_deadline: annualFeeDeadline
          ? new Date(annualFeeDeadline)
          : null,
        credit_line: Number(creditLine) || 0,
        current_balance: Number(currentBalance) || 0,
        description: description.trim() || null,
        benefits: benefits.trim() || null,
        expiry_month: Number(expiryMonth),
        expiry_year: Number(expiryYear),
      });

      if (success) {
        setStatusMsg(t('cardform.successMessage', 'dashboard'));
        resetForm();
        if (onClose) onClose();
      } else {
        setStatusMsg(t('cardform.errorGeneric', 'dashboard'));
      }
    } catch (err: any) {
      setStatusMsg(`${t('cardform.errorPrefix', 'dashboard')}: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = clsx(
    'w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5',
    'text-slate-900 placeholder:text-slate-400',
    'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
    'transition-all duration-200'
  );

  const labelClass = 'block text-sm font-medium text-slate-700 mb-2';

  const sectionClass = 'space-y-5';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {statusMsg && (
        <div
          className={clsx(
            'px-4 py-3 rounded-lg text-sm font-medium border',
            statusMsg.includes(t('cardform.successMessage', 'dashboard'))
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          )}
        >
          {statusMsg}
        </div>
      )}

      {/* Basic Information */}
      <div className={sectionClass}>
        <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-200">
          {t('cardform.sectionBasicInfo', 'dashboard')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>
              {t('cardform.aliasLabel', 'dashboard')} *
            </label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className={inputClass}
              placeholder={t('cardform.aliasPlaceholder', 'dashboard')}
              required
            />
          </div>
          <div>
            <label className={labelClass}>
              {t('cardform.bankLabel', 'dashboard')} *
            </label>
            <input
              type="text"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className={inputClass}
              placeholder={t('cardform.bankPlaceholder', 'dashboard')}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>
              {t('cardform.lastFourLabel', 'dashboard')} *
            </label>
            <input
              type="number"
              value={lastFourDigits}
              onChange={(e) => setLastFourDigits(e.target.value)}
              className={inputClass}
              placeholder="1234"
              min="0"
              max="9999"
              required
            />
          </div>
          <div>
            <label className={labelClass}>
              {t('cardform.networkLabel', 'dashboard')} *
            </label>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className={inputClass}
              required
            >
              <option value="">
                {t('cardform.networkPlaceholder', 'dashboard')}
              </option>
              <option value="Visa">Visa</option>
              <option value="Mastercard">Mastercard</option>
              <option value="American Express">American Express</option>
              <option value="Discover">Discover</option>
              <option value="Other">
                {t('cardform.networkOther', 'dashboard')}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className={sectionClass}>
        <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-200">
          {t('cardform.sectionDates', 'dashboard')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>
              {t('cardform.cutOffLabel', 'dashboard')} *
            </label>
            <input
              type="date"
              value={cutOffDate}
              onChange={(e) => setCutOffDate(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>
              {t('cardform.paymentLabel', 'dashboard')} *
            </label>
            <input
              type="date"
              value={paymentDeadline}
              onChange={(e) => setPaymentDeadline(e.target.value)}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>
              {t('cardform.expiryMonthLabel', 'dashboard')} *
            </label>
            <input
              type="number"
              value={expiryMonth}
              onChange={(e) => setExpiryMonth(e.target.value)}
              className={inputClass}
              min="1"
              max="12"
              placeholder="MM"
              required
            />
          </div>
          <div>
            <label className={labelClass}>
              {t('cardform.expiryYearLabel', 'dashboard')} *
            </label>
            <input
              type="number"
              value={expiryYear}
              onChange={(e) => setExpiryYear(e.target.value)}
              className={inputClass}
              min={new Date().getFullYear()}
              max={new Date().getFullYear() + 10}
              placeholder="YYYY"
              required
            />
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div className={sectionClass}>
        <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-200">
          {t('cardform.sectionFinancial', 'dashboard')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>
              {t('cardform.creditLineLabel', 'dashboard')} *
            </label>
            <input
              type="number"
              value={creditLine}
              onChange={(e) => setCreditLine(e.target.value)}
              className={inputClass}
              placeholder="5000.00"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className={labelClass}>
              {t('cardform.currentBalanceLabel', 'dashboard')}
            </label>
            <input
              type="number"
              value={currentBalance}
              onChange={(e) => setCurrentBalance(e.target.value)}
              className={inputClass}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>
              {t('cardform.annualFeeLabel', 'dashboard')}
            </label>
            <input
              type="number"
              value={annualFee}
              onChange={(e) => setAnnualFee(e.target.value)}
              className={inputClass}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className={labelClass}>
              {t('cardform.annualFeeDeadlineLabel', 'dashboard')}
            </label>
            <input
              type="date"
              value={annualFeeDeadline}
              onChange={(e) => setAnnualFeeDeadline(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className={sectionClass}>
        <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-200">
          {t('cardform.sectionAdditional', 'dashboard')}
        </h3>

        <div>
          <label className={labelClass}>
            {t('cardform.benefitsLabel', 'dashboard')}
          </label>
          <textarea
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            className={clsx(inputClass, 'min-h-[100px] resize-y')}
            placeholder={t('cardform.benefitsPlaceholder', 'dashboard')}
          />
        </div>

        <div>
          <label className={labelClass}>
            {t('cardform.descriptionLabel', 'dashboard')}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={clsx(inputClass, 'min-h-[100px] resize-y')}
            placeholder={t('cardform.descriptionPlaceholder', 'dashboard')}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-slate-200">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
            disabled={isSubmitting}
          >
            {t('cardform.cancelButton', 'dashboard')}
          </button>
        )}

        <button
          type="submit"
          className={clsx(
            'flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm',
            'bg-indigo-600 hover:bg-indigo-700 text-white',
            isSubmitting && 'opacity-70 cursor-not-allowed'
          )}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {t('cardform.submittingButton', 'dashboard')}
            </>
          ) : (
            <>
              <PlusCircle className="h-5 w-5" />
              {t('cardform.submitButton', 'dashboard')}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
