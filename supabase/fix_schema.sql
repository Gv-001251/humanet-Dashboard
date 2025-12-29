-- Add detected_ctc column if it doesn't exist
ALTER TABLE public.hiresmart_reviews 
ADD COLUMN IF NOT EXISTS detected_ctc NUMERIC CHECK (detected_ctc >= 0);

-- Refresh the schema cache (Reloading via the dashboard is usually required, but confirming constraints helps)
NOTIFY pgrst, 'reload config';
