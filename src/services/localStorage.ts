import type { Card } from '../types/card';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY = 'app_cards';

export const getCardsFromLocalStorage = (): Card[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

export const saveCardsToLocalStorage = (cards: Card[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cards));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const addCardToLocalStorage = (
  cardData: Omit<Card, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Card => {
  const newCard: Card = {
    id: uuidv4(),
    ...cardData,
    user_id: 'local_user',
  };
  const existingCards = getCardsFromLocalStorage();
  saveCardsToLocalStorage([newCard, ...existingCards]);
  return newCard;
};

export const updateCardInLocalStorage = (
  cardId: string,
  updatedFields: Partial<Card>
): Card | null => {
  const existingCards = getCardsFromLocalStorage();
  const cardIndex = existingCards.findIndex((card) => card.id === cardId);

  if (cardIndex === -1) {
    return null;
  }

  const updatedCard = {
    ...existingCards[cardIndex],
    ...updatedFields,
  };

  existingCards[cardIndex] = updatedCard;
  saveCardsToLocalStorage(existingCards);
  return updatedCard;
};

export const removeCardFromLocalStorage = (cardId: string): boolean => {
  const existingCards = getCardsFromLocalStorage();
  const initialLength = existingCards.length;
  const updatedCards = existingCards.filter((card) => card.id !== cardId);

  if (updatedCards.length < initialLength) {
    saveCardsToLocalStorage(updatedCards);
    return true;
  }
  return false;
};

export const clearLocalStorageCards = (): void => {
  try {
    localStorage.removeItem('card-storage');
    console.log('Cleared cards from Local Storage.');
  } catch (error) {
    console.error('Error clearing Local Storage:', error);
  }
};
