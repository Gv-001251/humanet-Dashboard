# MongoDB to Supabase Migration Guide

## Overview
This guide will help you complete the migration from MongoDB to Supabase for the Humanet Dashboard backend.

## Completed Steps ✓

1. **Updated Dependencies** - Replaced `mongodb` with `@supabase/supabase-js` in `package.json`
2. **Created Supabase Config** - New file: `src/config/supabase.js` handles Supabase initialization
3. **Updated .env** - Added `SUPABASE_URL` and `SUPABASE_KEY` credentials
4. **Migrated All DB Operations** - Converted all MongoDB operations in `server.js` to Supabase equivalents
5. **Created SQL Schema** - File: `SUPABASE_MIGRATION.sql` contains the database schema

## Steps to Complete the Migration

### Step 1: Install New Dependencies

```bash
cd humanet-backend
npm install
```

### Step 2: Set Up Supabase Tables

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (already created with credentials in `.env`)
3. Click on **SQL Editor** in the left sidebar
4. Create a new query and copy the entire content from `SUPABASE_MIGRATION.sql`
5. Run the SQL to create the tables and indexes

Alternatively, you can use the `psql` command line if you have PostgreSQL installed:

```bash
psql postgresql://postgres.wftnwhfccjcpsxumlioy:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres < SUPABASE_MIGRATION.sql
```

### Step 3: Migrate Existing Data (if applicable)

If you have existing MongoDB data, you'll need to migrate it to Supabase:

1. **Export MongoDB data** (use MongoDB Atlas export tools)
2. **Transform the data** to match the Supabase schema
3. **Import into Supabase** using the SQL Editor or import tools

### Step 4: Start the Backend Server

```bash
npm start
```

The server should now connect to Supabase instead of MongoDB.

## Configuration Details

### Environment Variables

Your `.env` file should contain:

```env
# Supabase Configuration
SUPABASE_URL=https://wftnwhfccjcpsxumlioy.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmdG53aGZjY2pjcHN4dW1saW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NzUyMTcsImV4cCI6MjA4MjU1MTIxN30.pC2bC-WeT2Arw894JaU6oBrg7L-6r7dPW8hHbJTrspg
```

### Key Changes in Code

1. **Imports**: Replaced `const { connectDB }` with `const { getSupabase, initSupabase }`

2. **Database Initialization**: 
   - Removed: MongoDB connection setup
   - Added: Supabase client initialization via `initSupabase()`

3. **Query Syntax**:
   - **MongoDB**: `await candidateCollection.findOne({ id: candidateId })`
   - **Supabase**: `await supabase.from('candidates').select('*').eq('id', candidateId).single()`

4. **Insert Operations**:
   - **MongoDB**: `await candidateCollection.insertOne(document)`
   - **Supabase**: `await supabase.from('candidates').insert([document])`

5. **Update Operations**:
   - **MongoDB**: `await candidateCollection.updateOne({ id }, { $set: { status } })`
   - **Supabase**: `await supabase.from('candidates').update({ status }).eq('id', id)`

6. **Delete Operations**:
   - **MongoDB**: `await candidateCollection.findOneAndDelete({ id })`
   - **Supabase**: `await supabase.from('candidates').delete().eq('id', id).select()`

## Database Schema

### Candidates Table
- `id` (PRIMARY KEY) - Unique candidate identifier
- `name` - Full name of the candidate
- `email` - Email address
- `phone` - Phone number
- `skills` - JSON array of skills
- `experience` - Years of experience (integer)
- `ctc` - Current/Expected CTC (bigint)
- `location` - Location of the candidate
- `domain` - Domain/specialization (Frontend, Backend, etc.)
- `status` - Candidate status (pending, shortlisted, rejected)
- `education` - Educational qualification
- `resumeUrl` - URL to resume file
- `talentScoutStatus` - Talent scout specific status
- `invitedAt` - Timestamp when invited
- `lastTalentScoutMessage` - Last message in talent scout
- `createdAt` - Record creation timestamp
- `updated_at` - Auto-updated timestamp

## Troubleshooting

### Connection Issues
If you see errors like "Supabase URL or Key not found":
1. Verify `.env` file has correct `SUPABASE_URL` and `SUPABASE_KEY`
2. Ensure the keys are properly formatted without extra spaces
3. Check that Supabase project is active in your dashboard

### Schema Not Found
If you get "relation 'candidates' does not exist":
1. Make sure you've run the SQL migration script in Supabase
2. Verify the table is visible in Supabase SQL Editor
3. Check table name spelling (case-sensitive in PostgreSQL)

### Data Type Mismatches
Supabase uses PostgreSQL types. Key differences from MongoDB:
- Arrays use `JSONB` type
- Timestamps use `TIMESTAMP WITH TIME ZONE`
- Numbers use `INTEGER` or `BIGINT` instead of flexible number types

## Rollback Plan

If you need to rollback to MongoDB:
1. Switch back the import: `const { connectDB } = require('./src/config/mongodb')`
2. Reinstall MongoDB dependency: `npm install mongodb@6.20.0`
3. Restart the server

## Notes

- All database operations now use async/await with Supabase
- Error handling has been updated to match Supabase's error structure
- Row Level Security (RLS) is enabled but set to allow public access - modify policies as needed
- Supabase automatically handles timestamps for `created_at` and `updated_at` columns

## Support

For more information:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
