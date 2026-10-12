import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://hmhnjoubjgikjsjzfvbh.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "sb_publishable_6vvLYp62EBkKsyqsGjMEhg_X4TMVZY6";

export const supabaseUrl =
  import.meta.env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;

export const supabaseAnonKey =
  import.meta.env?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://your-project-id.supabase.co"
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
      },
    })
  : null;

