-- Supabase Schema Migration for Humanet Dashboard
-- Run these SQL commands in your Supabase SQL Editor

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

CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create other tables for future use
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
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optional but recommended)
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (modify as needed for your security requirements)
CREATE POLICY "Allow public read access" ON candidates FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON candidates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON candidates FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON candidates FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON projects FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON projects FOR DELETE USING (true);
