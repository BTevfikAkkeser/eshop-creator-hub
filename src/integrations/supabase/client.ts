// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bvbsjfhuclqjzconvqml.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2YnNqZmh1Y2xxanpjb252cW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNTgzMjEsImV4cCI6MjA2ODgzNDMyMX0.vueiTNstvaYe68WQdnjDEgxl8aIZU3N1sub2T3kHeKU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});