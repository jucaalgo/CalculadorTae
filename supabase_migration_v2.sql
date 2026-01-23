-- Migration to V2: Enhanced Analytics
-- Run this in Supabase SQL Editor

ALTER TABLE public.access_logs 
ADD COLUMN IF NOT EXISTS org text,
ADD COLUMN IF NOT EXISTS region text,
ADD COLUMN IF NOT EXISTS platform text,
ADD COLUMN IF NOT EXISTS duration_seconds integer DEFAULT 0;

-- Ensure Update Policy allows anon to update their own log (simplification: open update for now or rely on Service Role if possible, but we use anon. 
-- RLS 'update' policy is needed for the heartbeat.)
create policy "Allow Public Updates"
on public.access_logs
for update
to anon
using (true)
with check (true);
