import supabase from '../utils/supabase';
import type { Card } from '../types/card';

export const fetchCardsFromSupabase = async (): Promise<Card[]> => {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Card[];
};

export const addCardToSupabase = async (
  card: Omit<Card, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<Card> => {
  const { data, error } = await supabase
    .from('cards')
    .insert([{ ...card }])
    .select()
    .single();

  if (error) throw error;
  return data as Card;
};

export const updateCardInSupabase = async (cardId: string, updatedFields: Partial<Card>): Promise<Card> => {
  const { data, error } = await supabase
    .from('cards')
    .update(updatedFields)
    .eq('id', cardId)
    .select()
    .single();

  if (error) throw error;
  return data as Card;
};

export const removeCardFromSupabase = async (cardId: string): Promise<void> => {
  const { error } = await supabase.from('cards').delete().eq('id', cardId);
  if (error) throw error;
};
