import React, { useState } from 'react';
import type { Card } from '../../types/card'; // Asegúrate de la ruta correcta
import {
  Banknote,
  CreditCard,
  CircleDollarSign,
  Info,
  Pencil,
  Trash2,
  CalendarDays,
  Gauge,
  Landmark,
  ReceiptText,
} from 'lucide-react';
import clsx from 'clsx'; // Opcional para Tailwind condicional, si no lo tienes, puedes instalarlo: npm i clsx

interface CardListItemProps {
  card: Card;
  onUpdateCard: (cardId: string, updatedFields: Partial<Card>) => void;
  onRemoveCard?: (cardId: string) => void;
}

const CardListItem: React.FC<CardListItemProps> = ({ card, onRemoveCard }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (date: Date | undefined) =>
    date ? new Date(date).toLocaleDateString() : 'N/A';

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString('es-MX')}`;

  const getNetworkIcon = (_network: string) => {
    // Aquí puedes expandir para mostrar iconos específicos de Visa/Mastercard, etc.
    // Por ahora, usaremos CreditCard genérico
    return <CreditCard size={16} className="text-gray-500" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
      <div
        className={clsx(
          'p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer',
          { 'bg-gray-50': isExpanded }
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between gap-3">
          <div className="flex items-center">
            <CreditCard className="text-blue-600" size={24} />
            <div>
              <h3 className="font-semibold text-lg text-gray-800">
                {card.alias}
              </h3>
              <p className="text-sm text-gray-500">
                <Landmark size={14} className="inline-block mr-1" />
                {card.bank} • **** {card.last_four_digits}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            {getNetworkIcon(card.network)}
            <span className="font-medium ml-2">Red:</span> {card.network}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Botones de acción directos, si es necesario */}
          {/* <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Pencil size={18} />
          </button>
          {onRemoveCard && (
            <button className="text-red-400 hover:text-red-600 transition-colors">
              <Trash2 size={18} />
            </button>
          )} */}
        </div>
      </div>

      {/* Sección de Detalles Principales (Siempre visible o en "Modo Compacto") */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-2 p-4 text-sm text-gray-700">
        <div className="flex items-center">
          <CircleDollarSign size={16} className="mr-2 text-green-600" />
          <span className="font-medium"></span>{' '}
          {formatCurrency(card.credit_line)}
        </div>
        <div className="flex items-center">
          <ReceiptText size={16} className="mr-2 text-orange-500" />
          <span className="font-medium">Saldo:</span>{' '}
          <span className="digit">{formatCurrency(card.current_balance)}</span>
        </div>

        <div className="flex items-center">
          <Gauge size={16} className="mr-2 text-indigo-600" />
          <span className="font-medium"></span>{' '}
          {card.credit_line > 0
            ? `${((card.current_balance / card.credit_line) * 100).toFixed(1)}%`
            : 'N/A'}
        </div>
      </div>

      {/* Sección Expandida (para más detalles) */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          {card.description && (
            <p className="text-gray-700 mb-3 flex items-start">
              <Info
                size={16}
                className="mr-2 mt-1 text-blue-500 flex-shrink-0"
              />
              <span className="font-medium mr-1">Descripción:</span>{' '}
              {card.description}
            </p>
          )}
          <p className="text-gray-700 mb-3 flex items-start">
            <Banknote
              size={16}
              className="mr-2 mt-1 text-lime-600 flex-shrink-0"
            />
            <span className="font-medium mr-1">Beneficios:</span>{' '}
            {card.benefits}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-700">
            <div className="flex items-center">
              <CircleDollarSign size={16} className="mr-2 text-gray-500" />
              <span className="font-medium">Anualidad:</span>{' '}
              {formatCurrency(card.annual_fee)}
            </div>
            {card.annual_fee_deadline && (
              <div className="flex items-center">
                <CalendarDays size={16} className="mr-2 text-gray-500" />
                <span className="font-medium">Límite Anualidad:</span>{' '}
                {formatDate(card.annual_fee_deadline)}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t pt-4 border-gray-100">
            <button
              onClick={() => {
                // Ejemplo de actualización: abre un modal o formulario para editar
                alert('Funcionalidad de edición de tarjeta (futuro)');
                // onUpdateCard(card.id, { alias: `${card.alias} - Editado` });
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-md text-sm"
            >
              <Pencil size={16} className="mr-2" /> Editar
            </button>
            {onRemoveCard && (
              <button
                onClick={() => onRemoveCard(card.id)}
                className="inline-flex items-center px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors shadow-md text-sm"
              >
                <Trash2 size={16} className="mr-2" /> Eliminar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardListItem;
