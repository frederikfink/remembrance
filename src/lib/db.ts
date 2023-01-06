import { env } from '$env/dynamic/public';
import { createClient } from '@supabase/auth-helpers-sveltekit';

const supabaseUrl = env.PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
);