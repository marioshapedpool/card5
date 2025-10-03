import React, { useState, useMemo } from 'react';
import type { Card } from '../../types/card';
import {
  CreditCard,
  ArrowDown,
  ArrowUp,
  Edit,
  Trash2,
  X,
  Save,
} from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

interface CardListProps {
  cards: Card[];
  onUpdateCard: (cardId: string, updatedFields: Partial<Card>) => void;
  onRemoveCard?: (cardId: string) => void;
}

export function CardList({ cards, onUpdateCard, onRemoveCard }: CardListProps) {
  const { t } = useTranslation();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Card;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Card>>({});

  const sortedCards = useMemo(() => {
    let sortableCards = [...cards];
    if (sortConfig !== null) {
      sortableCards.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue instanceof Date && bValue instanceof Date) {
          const aTime = aValue.getTime();
          const bTime = bValue.getTime();
          if (aTime < bTime) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (aTime > bTime) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        }

        const aString = String(aValue);
        const bString = String(bValue);

        if (aString < bString) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aString > bString) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableCards;
  }, [cards, sortConfig]);

  const requestSort = (key: keyof Card) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Card) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? (
      <ArrowUp className="inline-block ml-1 h-4 w-4 text-slate-500" />
    ) : (
      <ArrowDown className="inline-block ml-1 h-4 w-4 text-slate-500" />
    );
  };

  const handleEdit = (card: Card) => {
    setEditingCard(card.id);
    setEditFormData({
      alias: card.alias,
      bank: card.bank,
      network: card.network,
      credit_line: card.credit_line,
      current_balance: card.current_balance,
      annual_fee: card.annual_fee,
      cut_off_date: card.cut_off_date,
      payment_deadline: card.payment_deadline,
      annual_fee_deadline: card.annual_fee_deadline,
      expiry_month: card.expiry_month,
      expiry_year: card.expiry_year,
      benefits: card.benefits,
      description: card.description,
    });
  };

  const handleSaveEdit = (cardId: string) => {
    onUpdateCard(cardId, editFormData);
    setEditingCard(null);
    setEditFormData({});
  };

  const handleCancelEdit = () => {
    setEditingCard(null);
    setEditFormData({});
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-';
    return value.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (cards.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
            <CreditCard className="text-slate-400" size={32} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              {t('cardlist.noCards', 'dashboard')}
            </h3>
            <p className="text-slate-600">
              {t('cardlist.addFirstCard', 'dashboard')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => requestSort('alias')}
              >
                {t('cardlist.alias', 'dashboard')}
                {getSortIcon('alias')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => requestSort('bank')}
              >
                {t('cardlist.bank', 'dashboard')}
                {getSortIcon('bank')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                {t('cardlist.lastFour', 'dashboard')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => requestSort('network')}
              >
                {t('cardlist.network', 'dashboard')}
                {getSortIcon('network')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => requestSort('credit_line')}
              >
                {t('cardlist.creditLine', 'dashboard')}
                {getSortIcon('credit_line')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => requestSort('current_balance')}
              >
                {t('cardlist.balance', 'dashboard')}
                {getSortIcon('current_balance')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                {t('cardlist.actions', 'dashboard')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {sortedCards.map((card) => (
              <React.Fragment key={card.id}>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {card.alias}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {card.bank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-mono">
                    **** {card.last_four_digits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {card.network}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {formatCurrency(card.credit_line)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {formatCurrency(card.current_balance)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(card)}
                        className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                        title={t('cardlist.editButton', 'dashboard')}
                      >
                        <Edit size={18} />
                      </button>
                      {onRemoveCard && (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                t('cardlist.confirmDelete', 'dashboard')
                              )
                            ) {
                              onRemoveCard(card.id);
                            }
                          }}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title={t('cardlist.deleteButton', 'dashboard')}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>

                {/* Edit Form Row */}
                {editingCard === card.id && (
                  <tr className="bg-slate-50">
                    <td colSpan={7} className="px-6 py-6">
                      <div className="bg-white rounded-lg border border-slate-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                          {t('cardlist.editFormTitle', 'dashboard')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              {t('cardlist.alias', 'dashboard')}
                            </label>
                            <input
                              type="text"
                              value={editFormData.alias || ''}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  alias: e.target.value,
                                })
                              }
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              {t('cardlist.bank', 'dashboard')}
                            </label>
                            <input
                              type="text"
                              value={editFormData.bank || ''}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  bank: e.target.value,
                                })
                              }
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              {t('cardlist.network', 'dashboard')}
                            </label>
                            <select
                              value={editFormData.network || ''}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  network: e.target.value,
                                })
                              }
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            >
                              <option value="Visa">Visa</option>
                              <option value="Mastercard">Mastercard</option>
                              <option value="American Express">
                                American Express
                              </option>
                              <option value="Discover">Discover</option>
                              <option value="Other">
                                {t('cardform.networkOther', 'dashboard')}
                              </option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              {t('cardlist.creditLine', 'dashboard')}
                            </label>
                            <input
                              type="number"
                              value={editFormData.credit_line || ''}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  credit_line: Number(e.target.value),
                                })
                              }
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              {t('cardlist.balance', 'dashboard')}
                            </label>
                            <input
                              type="number"
                              value={editFormData.current_balance || ''}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  current_balance: Number(e.target.value),
                                })
                              }
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              {t('cardlist.annualFee', 'dashboard')}
                            </label>
                            <input
                              type="number"
                              value={editFormData.annual_fee || ''}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  annual_fee: Number(e.target.value),
                                })
                              }
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                          >
                            <X size={18} />
                            {t('cardlist.cancelButton', 'dashboard')}
                          </button>
                          <button
                            onClick={() => handleSaveEdit(card.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                          >
                            <Save size={18} />
                            {t('cardlist.saveButton', 'dashboard')}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
