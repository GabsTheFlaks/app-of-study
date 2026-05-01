import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://znnijuuhlgbyeniroods.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpubmlqdXVobGdieWVuaXJvb2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1ODEwMzEsImV4cCI6MjA5MzE1NzAzMX0.Uo4_eqk21pw7-aYtYsaNdJ6TLdBsHacjom39scSvm4g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
