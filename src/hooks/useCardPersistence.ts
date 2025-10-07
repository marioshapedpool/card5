import { useEffect } from 'react';
import { useCardStore } from '../store/card';
import useUser from '../hooks/useUser';
import {
  getCardsFromLocalStorage,
  saveCardsToLocalStorage,
  addCardToLocalStorage,
  updateCardInLocalStorage,
  removeCardFromLocalStorage,
  clearLocalStorageCards,
} from '../services/localStorage';
import {
  fetchCardsFromSupabase,
  addCardToSupabase,
  updateCardInSupabase,
  removeCardFromSupabase,
} from '../services/supabase';
import type { Card } from '../types/card';
import { v4 as uuidv4 } from 'uuid';
import supabase from '../utils/supabase';

export const useCardPersistence = () => {
  const {
    cards: storeCards,
    setCards,
    setLoading,
    setError,
    addCardToState,
    updateCardInState,
    removeCardFromState,
    clearCards: clearStoreCards,
  } = useCardStore();

  const { user, loading: authLoading } = useUser();

  useEffect(() => {
    const loadCards = async () => {
      setLoading(true);
      setError(null);
      try {
        if (user) {
          console.log('User logged in, fetching from Supabase...');
          const supabaseCards = await fetchCardsFromSupabase();
          setCards(supabaseCards);
          saveCardsToLocalStorage(supabaseCards);
          console.log('Loaded from Supabase, saved to LocalStorage.');
        } else {
          console.log('No user logged in, fetching from LocalStorage...');
          const localCards = getCardsFromLocalStorage();
          setCards(localCards);
          console.log('Loaded from LocalStorage.');
        }
      } catch (err: any) {
        console.error('Error loading cards:', err);
        setError(err.message || 'Failed to load cards');
        if (user) {
          console.log(
            'Supabase fetch failed, attempting LocalStorage fallback...'
          );
          try {
            const localCards = getCardsFromLocalStorage();
            setCards(localCards);
            setError(
              'Failed to sync with Supabase, loaded from local storage.'
            );
            console.log('Loaded from LocalStorage as fallback.');
          } catch (localStorageErr) {
            console.error('LocalStorage fallback failed:', localStorageErr);
            setError('Failed to load cards from both sources.');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    // Solo ejecutar si el estado de autenticación ya se ha resuelto
    if (!authLoading) {
      loadCards();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!authLoading && user === null) {
      console.log('User logged out, clearing Local Storage cards.');
      clearLocalStorageCards();
      clearStoreCards();
    }
  }, [user, authLoading]);

  const handleAddCard = async (
    newCardData: Omit<Card, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    let addedCard: Card | null = null;

    try {
      if (user) {
        console.log('Adding card to Supabase...');
        const cardToAdd = { ...newCardData, user_id: user.id };
        addedCard = await addCardToSupabase(cardToAdd);
        addCardToState(addedCard);
        saveCardsToLocalStorage([addedCard, ...getCardsFromLocalStorage()]);
        console.log('Card added to Supabase and LocalStorage.');
      } else {
        console.log('Adding card to LocalStorage...');
        const cardToAdd = {
          ...newCardData,
          user_id: 'local_user',
          id: uuidv4(),
        };
        addedCard = addCardToLocalStorage(cardToAdd);
        addCardToState(addedCard);
        console.log('Card added to LocalStorage.');
      }
      return true;
    } catch (err: any) {
      console.error('Error adding card:', err);
      setError(err.message || 'Failed to add card');
      if (user) {
        console.log('Supabase add failed, attempting LocalStorage add...');
        try {
          addedCard = addCardToLocalStorage(newCardData);
          addCardToState(addedCard);
          setError('Failed to add to Supabase, saved locally.');
          console.log('Card added to LocalStorage as fallback.');
          return true;
        } catch (localStorageErr) {
          console.error('LocalStorage fallback add failed:', localStorageErr);
          setError('Failed to add card (Supabase and Local)');
          return false;
        }
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCard = async (
    cardId: string,
    updatedFields: Partial<Card>
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    let updatedCard: Card | null = null;

    try {
      if (user) {
        console.log(`Updating card ${cardId} in Supabase...`);
        updatedCard = await updateCardInSupabase(cardId, updatedFields);
        updateCardInState(updatedCard.id, updatedCard);
        saveCardsToLocalStorage([
          updatedCard,
          ...getCardsFromLocalStorage().filter((c) => c.id !== cardId),
        ]);
        console.log('Card updated in Supabase and LocalStorage.');
      } else {
        console.log(`Updating card ${cardId} in LocalStorage...`);
        updatedCard = updateCardInLocalStorage(cardId, updatedFields);
        if (updatedCard) {
          updateCardInState(updatedCard.id, updatedCard);
          console.log('Card updated in LocalStorage.');
        } else {
          setError('Card not found in local storage.');
          console.warn(`Card ${cardId} not found in LocalStorage for update.`);
          return false;
        }
      }
      return true;
    } catch (err: any) {
      console.error('Error updating card:', err);
      setError(err.message || 'Failed to update card');
      if (user) {
        console.log(
          `Supabase update failed for ${cardId}, attempting LocalStorage update...`
        );
        try {
          updatedCard = updateCardInLocalStorage(cardId, updatedFields);
          if (updatedCard) {
            updateCardInState(updatedCard.id, updatedCard);
            setError('Failed to update on Supabase, updated locally.');
            console.log('Card updated in LocalStorage as fallback.');
            return true;
          } else {
            setError(
              'Failed to update card (Supabase failed, not found locally)'
            );
            return false;
          }
        } catch (localStorageErr) {
          console.error(
            'LocalStorage fallback update failed:',
            localStorageErr
          );
          setError('Failed to update card (Supabase and Local)');
          return false;
        }
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCard = async (cardId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      if (user) {
        console.log(`Removing card ${cardId} from Supabase...`);
        await removeCardFromSupabase(cardId);
        removeCardFromState(cardId);
        saveCardsToLocalStorage(
          getCardsFromLocalStorage().filter((c) => c.id !== cardId)
        );
        console.log('Card removed from Supabase and LocalStorage.');
      } else {
        console.log(`Removing card ${cardId} from LocalStorage...`);
        const removed = removeCardFromLocalStorage(cardId);
        if (removed) {
          removeCardFromState(cardId);
          console.log('Card removed from LocalStorage.');
        } else {
          setError('Card not found in local storage.');
          console.warn(`Card ${cardId} not found in LocalStorage for removal.`);
          return false;
        }
      }
      return true;
    } catch (err: any) {
      console.error('Error removing card:', err);
      setError(err.message || 'Failed to remove card');
      if (user) {
        console.log(
          `Supabase remove failed for ${cardId}, attempting LocalStorage remove...`
        );
        try {
          const removed = removeCardFromLocalStorage(cardId);
          if (removed) {
            removeCardFromState(cardId);
            setError('Failed to remove from Supabase, removed locally.');
            console.log('Card removed from LocalStorage as fallback.');
            return true;
          } else {
            setError(
              'Failed to remove card (Supabase failed, not found locally)'
            );
            return false;
          }
        } catch (localStorageErr) {
          console.error(
            'LocalStorage fallback remove failed:',
            localStorageErr
          );
          setError('Failed to remove card (Supabase and Local)');
          return false;
        }
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return {
    cards: storeCards,
    isLoading: setLoading,
    error: setError,
    handleAddCard,
    handleUpdateCard,
    handleRemoveCard,
    logout,
  };
};
