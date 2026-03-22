import { createClient } from '@supabase/supabase-js';

// Using environment variables with fallbacks to the values you provided
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rlkusvcstdoohstmgdhn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_iwJY50ztZ2beo1JpoBb-2g_mWnldhiD';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase environment variables are missing. Using default values provided in prompt.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
