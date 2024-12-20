import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xwfgazxfjsoznyemwxeb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3ZmdhenhmanNvem55ZW13eGViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2ODAyODEsImV4cCI6MjA1MDI1NjI4MX0.SWic7hnn8kHBA2dPC3_xtVqUKhFagQQ1BkZhITbp5Zc';
const STORAGE_URL =  'https://xwfgazxfjsoznyemwxeb.supabase.co/storage/v1/';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export { SUPABASE_URL, SUPABASE_ANON_KEY, STORAGE_URL };

