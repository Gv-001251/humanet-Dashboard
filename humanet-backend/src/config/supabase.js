const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

let supabase = null;

const initSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl) {
    console.error('❌ SUPABASE_URL not found in environment variables');
    console.error('   Add SUPABASE_URL to your .env file');
    return null;
  }

  if (!supabaseKey) {
    console.error('❌ SUPABASE_KEY not found in environment variables');
    console.error('   Add SUPABASE_KEY to your .env file');
    return null;
  }

  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase initialized successfully');
    console.log(`   URL: ${supabaseUrl}`);
    return supabase;
  } catch (error) {
    console.error('❌ Failed to initialize Supabase:', error.message);
    return null;
  }
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
