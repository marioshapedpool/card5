import { useEffect } from 'react';
import { useCardStore } from '../store/card';

export function useCards() {
  const { cards, addCard, updateCard, removeCard, clearCards, fetchCards } =
    useCardStore();

  useEffect(() => {
    fetchCards();
    console.log('fetching from supa');
  }, [fetchCards]);

  return {
    cards,
    addCard,
    updateCard,
    removeCard,
    clearCards,
    totalCards: cards.length,
    isEmpty: cards.length === 0,
  };
}
