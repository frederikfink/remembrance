import { createClient } from '@supabase/auth-helpers-sveltekit';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
);