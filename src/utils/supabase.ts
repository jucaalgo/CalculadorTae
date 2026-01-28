import { createClient } from '@supabase/supabase-js';

// Unified Strategy: Use Env Vars
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

/**
 * UNIQUE APP ID
 */
export const APP_ID = 'fincalc-pro';
