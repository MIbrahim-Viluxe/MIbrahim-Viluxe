import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://iucdokhmviwxnfwxekah.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_AfWq4wekVTnfCjYWzCs2aw_XgtHxJed";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
