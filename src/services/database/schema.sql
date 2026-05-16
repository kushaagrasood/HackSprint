-- HackSprint Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE (extends Supabase auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- HACKATHONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.hackathons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'archived')),
  category TEXT,
  tags TEXT[],
  github_url TEXT,
  demo_url TEXT,
  submission_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TASKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hackathon_id UUID REFERENCES public.hackathons(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'blocked')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  tags TEXT[],
  due_date TIMESTAMP WITH TIME ZONE,
  time_spent INTEGER DEFAULT 0, -- in minutes
  estimated_time INTEGER, -- in minutes
  order_index INTEGER DEFAULT 0,
  parent_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- CHECKLISTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.checklists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hackathon_id UUID REFERENCES public.hackathons(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  template_type TEXT CHECK (template_type IN ('pre_hackathon', 'during_hackathon', 'post_hackathon', 'pitch_prep', 'custom')),
  items JSONB DEFAULT '[]'::jsonb, -- Array of checklist items
  progress INTEGER DEFAULT 0, -- Percentage
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PITCHES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.pitches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hackathon_id UUID REFERENCES public.hackathons(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT, -- Rich text content
  slides JSONB DEFAULT '[]'::jsonb, -- Array of slide objects
  notes TEXT,
  practice_sessions JSONB DEFAULT '[]'::jsonb, -- Array of practice session data
  duration INTEGER, -- Target duration in minutes
  template_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TEMPLATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('task', 'checklist', 'pitch', 'hackathon')),
  category TEXT CHECK (category IN ('web', 'mobile', 'ai_ml', 'blockchain', 'iot', 'game', 'general')),
  name TEXT NOT NULL,
  description TEXT,
  content JSONB NOT NULL, -- Template content structure
  is_public BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  tags TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ANALYTICS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hackathon_id UUID REFERENCES public.hackathons(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  tasks_completed INTEGER DEFAULT 0,
  tasks_created INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in minutes
  productivity_score DECIMAL(5,2),
  metrics JSONB DEFAULT '{}'::jsonb, -- Additional metrics
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hackathon_id, date)
);

-- =====================================================
-- TIME ENTRIES TABLE (for detailed time tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.time_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in minutes
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ACTIVITY LOG TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  hackathon_id UUID REFERENCES public.hackathons(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES for better query performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_hackathons_user_id ON public.hackathons(user_id);
CREATE INDEX IF NOT EXISTS idx_hackathons_status ON public.hackathons(status);
CREATE INDEX IF NOT EXISTS idx_tasks_hackathon_id ON public.tasks(hackathon_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);
CREATE INDEX IF NOT EXISTS idx_checklists_hackathon_id ON public.checklists(hackathon_id);
CREATE INDEX IF NOT EXISTS idx_pitches_hackathon_id ON public.pitches(hackathon_id);
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON public.templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_type ON public.templates(type);
CREATE INDEX IF NOT EXISTS idx_templates_is_public ON public.templates(is_public);
CREATE INDEX IF NOT EXISTS idx_analytics_hackathon_id ON public.analytics(hackathon_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON public.analytics(date);
CREATE INDEX IF NOT EXISTS idx_time_entries_task_id ON public.time_entries(task_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON public.activity_log(user_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate task completion percentage
CREATE OR REPLACE FUNCTION calculate_task_completion(hackathon_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_tasks INTEGER;
  completed_tasks INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_tasks FROM public.tasks WHERE hackathon_id = hackathon_uuid;
  SELECT COUNT(*) INTO completed_tasks FROM public.tasks WHERE hackathon_id = hackathon_uuid AND status = 'done';
  
  IF total_tasks = 0 THEN
    RETURN 0;
  END IF;
  
  RETURN ROUND((completed_tasks::DECIMAL / total_tasks::DECIMAL) * 100, 2);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to update updated_at on all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hackathons_updated_at BEFORE UPDATE ON public.hackathons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checklists_updated_at BEFORE UPDATE ON public.checklists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pitches_updated_at BEFORE UPDATE ON public.pitches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_updated_at BEFORE UPDATE ON public.analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pitches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Hackathons policies
CREATE POLICY "Users can view own hackathons" ON public.hackathons
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own hackathons" ON public.hackathons
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own hackathons" ON public.hackathons
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own hackathons" ON public.hackathons
  FOR DELETE USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can view own tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Checklists policies
CREATE POLICY "Users can view own checklists" ON public.checklists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own checklists" ON public.checklists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checklists" ON public.checklists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own checklists" ON public.checklists
  FOR DELETE USING (auth.uid() = user_id);

-- Pitches policies
CREATE POLICY "Users can view own pitches" ON public.pitches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own pitches" ON public.pitches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pitches" ON public.pitches
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pitches" ON public.pitches
  FOR DELETE USING (auth.uid() = user_id);

-- Templates policies
CREATE POLICY "Users can view own and public templates" ON public.templates
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create own templates" ON public.templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates" ON public.templates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates" ON public.templates
  FOR DELETE USING (auth.uid() = user_id);

-- Analytics policies
CREATE POLICY "Users can view own analytics" ON public.analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own analytics" ON public.analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics" ON public.analytics
  FOR UPDATE USING (auth.uid() = user_id);

-- Time entries policies
CREATE POLICY "Users can view own time entries" ON public.time_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own time entries" ON public.time_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own time entries" ON public.time_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own time entries" ON public.time_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Activity log policies
CREATE POLICY "Users can view own activity" ON public.activity_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own activity" ON public.activity_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- STORAGE BUCKETS (Run in Supabase Dashboard > Storage)
-- =====================================================
-- Create these buckets manually in Supabase Dashboard:
-- 1. avatars (public)
-- 2. attachments (private)
-- 3. exports (private)

-- =====================================================
-- SEED DATA (Optional - for development)
-- =====================================================

-- Insert sample template categories
INSERT INTO public.templates (user_id, type, category, name, description, content, is_public, is_featured)
VALUES
  (auth.uid(), 'checklist', 'general', 'Pre-Hackathon Checklist', 'Essential tasks before starting a hackathon', 
   '{"items": ["Research problem statement", "Form team", "Setup development environment", "Plan architecture"]}', true, true),
  (auth.uid(), 'checklist', 'general', 'During Hackathon Checklist', 'Tasks to complete during the hackathon', 
   '{"items": ["Build MVP", "Test features", "Prepare demo", "Create presentation"]}', true, true),
  (auth.uid(), 'checklist', 'general', 'Post-Hackathon Checklist', 'Follow-up tasks after the hackathon', 
   '{"items": ["Submit project", "Update documentation", "Share on social media", "Follow up with judges"]}', true, true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- NOTES
-- =====================================================
-- After running this schema:
-- 1. Enable Realtime for tables you want to subscribe to
-- 2. Configure Storage buckets and policies
-- 3. Set up authentication providers in Supabase Dashboard
-- 4. Update RLS policies as needed for your use case

-- Made with Bob
