import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Game {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  genre: string;
  release_date: string;
  rating: number;
  publisher: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  game_id: string;
  quantity: number;
  created_at: string;
  games?: Game;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}
