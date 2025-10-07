import { create } from 'zustand';
import supabase from '../utils/supabase';
import type { Card, CardStore } from '../types/card';

export const useCardStore = create<CardStore>((set, get) => ({
  cards: [],
  isLoading: false,
  error: null,
  setCards: (cards: Card[]) => set({ cards }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),

  addCardToState: (card: Card) =>
    set((state) => ({ cards: [card, ...state.cards] })),

  updateCardInState: (cardId: string, updatedFields: Partial<Card>) =>
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === cardId ? { ...c, ...updatedFields } : c
      ),
    })),

  removeCardFromState: (cardId: string) =>
    set((state) => ({ cards: state.cards.filter((c) => c.id !== cardId) })),

  fetchCards: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      set({ error: error.message, isLoading: false });
    } else {
      set({ cards: data as Card[], isLoading: false });
    }
  },

  addCard: async (
    card: Omit<Card, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    set({ isLoading: true });

    const { data, error } = await supabase
      .from('cards')
      .insert([{ ...card }])
      .select()
      .single();

    if (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }

    set({ cards: [data as Card, ...get().cards], isLoading: false });
    return true;
  },

  updateCard: async (cardId, updatedFields) => {
    const { data, error } = await supabase
      .from('cards')
      .update(updatedFields)
      .eq('id', cardId)
      .select()
      .single();

    if (error) {
      set({ error: error.message });
      return;
    }

    set({
      cards: get().cards.map((c) => (c.id === cardId ? (data as Card) : c)),
    });
  },

  removeCard: async (cardId) => {
    const { error } = await supabase.from('cards').delete().eq('id', cardId);

    if (error) {
      set({ error: error.message });
      return;
    }

    set({ cards: get().cards.filter((c) => c.id !== cardId) });
  },

  clearCards: () => set({ cards: [] }),
}));
