#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL or SUPABASE_KEY not found in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const migrationSQL = `
-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  experience INTEGER,
  ctc BIGINT,
  location TEXT,
  domain TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'shortlisted', 'rejected')),
  education TEXT,
  "resumeUrl" TEXT,
  "talentScoutStatus" TEXT,
  "invitedAt" TIMESTAMP WITH TIME ZONE,
  "lastTalentScoutMessage" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on id for faster lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_candidates_id ON candidates(id);

-- Create index on email for faster searches
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status);

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_candidates_updated_at BEFORE UPDATE ON candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  progress INTEGER DEFAULT 0,
  "assignedEmployees" JSONB DEFAULT '[]'::jsonb,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for projects table
CREATE TRIGGER IF NOT EXISTS update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
DROP POLICY IF EXISTS "Allow public read access" ON candidates;
DROP POLICY IF EXISTS "Allow public insert access" ON candidates;
DROP POLICY IF EXISTS "Allow public update access" ON candidates;
DROP POLICY IF EXISTS "Allow public delete access" ON candidates;

CREATE POLICY "Allow public read access" ON candidates FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON candidates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON candidates FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON candidates FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public read access" ON projects;
DROP POLICY IF EXISTS "Allow public insert access" ON projects;
DROP POLICY IF EXISTS "Allow public update access" ON projects;
DROP POLICY IF EXISTS "Allow public delete access" ON projects;

CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON projects FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON projects FOR DELETE USING (true);
`;

async function runMigration() {
  try {
    console.log('🚀 Starting Supabase migration...');
    console.log('📊 Running SQL migration...');

    const { error } = await supabase.rpc('exec', {
      sql: migrationSQL
    }).catch(() => {
      // Fallback: use raw query execution through multiple statements
      return executeSQLStatements(supabase, migrationSQL);
    });

    if (error) {
      // Try alternative approach
      return executeSQLStatements(supabase, migrationSQL);
    }

    console.log('✅ Migration completed successfully!');
    console.log('📋 Tables created:');
    console.log('   - candidates');
    console.log('   - projects');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\n⚠️  If the error mentions "relation already exists", this is normal.');
    console.log('📝 Please manually run the SQL in Supabase:');
    console.log('   1. Go to https://supabase.com/dashboard');
    console.log('   2. Click SQL Editor');
    console.log('   3. Create a new query');
    console.log('   4. Copy content from SUPABASE_MIGRATION.sql');
    console.log('   5. Execute the query');
    process.exit(1);
  }
}

async function executeSQLStatements(supabase, sql) {
  // Split by semicolon and execute individually
  const statements = sql.split(';').filter(stmt => stmt.trim());
  
  for (const statement of statements) {
    try {
      const result = await supabase.rpc('exec', { sql: statement.trim() });
      if (result.error && !result.error.message.includes('already exists')) {
        throw result.error;
      }
    } catch (error) {
      console.warn(`⚠️  Statement skipped (may already exist):`, error.message);
    }
  }
}

runMigration();
