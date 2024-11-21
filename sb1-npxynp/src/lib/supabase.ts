import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  settings: {
    smsReminders: boolean;
    emailAlerts: boolean;
    twoFactorEnabled: boolean;
  };
  status: 'active' | 'suspended' | 'pending_verification';
  lastLoginAt: string;
  loginAttempts: number;
  created_at: string;
  is_admin: boolean;
  challenge_start_date: string | null;
}