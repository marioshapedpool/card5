export interface Card {
  id: string;
  user_id: string;
  alias: string;
  bank: string;
  last_four_digits: number;
  cut_off_date: Date;
  payment_deadline: Date;
  network: string;
  annual_fee: number;
  annual_fee_deadline?: Date | null;
  credit_line: number;
  current_balance: number;
  description?: string | null;
  benefits?: string | null;
  expiry_month: number;
  expiry_year: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface CardStore {
  cards: Card[];
  addCard: (card: Omit<Card, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateCard: (cardId: string, updatedFields: Partial<Card>) => void;
  removeCard: (cardId: string) => void;
  clearCards: () => void;
  fetchCards: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}
