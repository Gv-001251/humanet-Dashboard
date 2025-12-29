const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

let supabase = null;

const initSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key not found in environment variables');
    return null;
  }

  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Supabase initialized successfully');
  return supabase;
};

const getSupabase = () => {
  if (!supabase) {
    return initSupabase();
  }
  return supabase;
};

module.exports = {
  initSupabase,
  getSupabase
};
