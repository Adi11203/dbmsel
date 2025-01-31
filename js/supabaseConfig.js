import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ccyvfdwemvlicolflcqm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjeXZmZHdlbXZsaWNvbGZsY3FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1Nzg0ODgsImV4cCI6MjA1MzE1NDQ4OH0.eM5ZyOdHr6pWVrj3QwfPzkSepoeEevJS5OF8JuwFK2o';

// Ensure this line comes first before using the `supabase` variable
export const supabase = createClient(supabaseUrl, supabaseKey);
