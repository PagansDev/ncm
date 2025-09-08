import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;

export function useSupabaseClientApp(): SupabaseClient {
  if (cachedClient) return cachedClient;
  const runtimeConfig = useRuntimeConfig();
  const supabaseUrl = runtimeConfig.public.supabaseUrl as string | undefined;
  const supabaseKey = runtimeConfig.public.supabaseAnonKey as
    | string
    | undefined;

  if (!supabaseUrl || !supabaseKey) {
    // Missing runtime config; proceeding to create client with empty strings to avoid runtime crash
  }

  cachedClient = createClient(supabaseUrl || '', supabaseKey || '');
  return cachedClient;
}
