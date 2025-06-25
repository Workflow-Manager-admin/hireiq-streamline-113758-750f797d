import { createClient } from '@supabase/supabase-js';

// PUBLIC_INTERFACE
// Runtime sanity check for required env vars
if (
  !process.env.REACT_APP_SUPABASE_URL ||
  !process.env.REACT_APP_SUPABASE_ANON_KEY
) {
  // eslint-disable-next-line
  console.error(
    '[FATAL]: Missing Supabase environment variables. Please check .env file and ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set.'
  );
}

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);
