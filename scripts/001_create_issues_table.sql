-- Create issues table for WeReport platform
CREATE TABLE IF NOT EXISTS public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 5),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'resolved', 'rejected')),
  location TEXT NOT NULL,
  coordinates JSONB NOT NULL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_authority TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on issues table
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- RLS Policies for issues
CREATE POLICY "Allow all authenticated users to view issues"
  ON public.issues FOR SELECT
  USING (TRUE);

CREATE POLICY "Allow users to insert their own issues"
  ON public.issues FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own issues"
  ON public.issues FOR UPDATE
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow users to delete their own issues"
  ON public.issues FOR DELETE
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'service_role');

-- Create indexes for performance
CREATE INDEX idx_issues_user_id ON public.issues(user_id);
CREATE INDEX idx_issues_status ON public.issues(status);
CREATE INDEX idx_issues_category ON public.issues(category);
CREATE INDEX idx_issues_created_at ON public.issues(created_at DESC);
CREATE INDEX idx_issues_upvotes ON public.issues(upvotes DESC);
