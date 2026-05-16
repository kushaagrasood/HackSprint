-- Migration: Add url column to checklist_items table
-- Run this if you already have the checklist_items table without the url column

ALTER TABLE public.checklist_items 
ADD COLUMN IF NOT EXISTS url TEXT;

-- Made with Bob