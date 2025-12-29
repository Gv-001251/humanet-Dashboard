-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create employees table (Internal Matching)
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT NOT NULL,
    skills TEXT[] DEFAULT '{}',
    experience_summary TEXT,
    current_ctc NUMERIC CHECK (current_ctc >= 0), -- Nullable, non-negative
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for employees
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create hiresmart_reviews table (External Candidates)
CREATE TABLE IF NOT EXISTS public.hiresmart_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_name TEXT NOT NULL,
    email TEXT,
    resume_url TEXT,
    extracted_skills TEXT[] DEFAULT '{}',
    ai_analysis JSONB DEFAULT '{}'::jsonb,
    detected_ctc NUMERIC CHECK (detected_ctc >= 0), -- STRICTLY explicitly found, else NULL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for hiresmart_reviews
ALTER TABLE public.hiresmart_reviews ENABLE ROW LEVEL SECURITY;

-- Create indexes for common search fields
CREATE INDEX IF NOT EXISTS employees_skills_idx ON public.employees USING GIN (skills);
CREATE INDEX IF NOT EXISTS hiresmart_reviews_email_idx ON public.hiresmart_reviews (email);
