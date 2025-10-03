import { create } from 'zustand';
import supabase from '../utils/supabase';
import type { Card, CardStore } from '../types/card';

export const useCardStore = create<CardStore>((set, get) => ({
  cards: [],
  isLoading: false,
  error: null,

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

  addCard: async (card) => {
    set({ isLoading: true });

    // 👇 el user_id se rellena automáticamente con auth.uid() en la policy
    const { data, error } = await supabase
      .from('cards')
      .insert([{ ...card }]) // user_id no hace falta si usas policies correctas
      .select()
      .single();

    if (error) {
      set({ error: error.message, isLoading: false });
      return;
    }

    set({ cards: [data as Card, ...get().cards], isLoading: false });
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
