-- Create upvotes tracking table
CREATE TABLE IF NOT EXISTS public.upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(issue_id, user_id)
);

-- Enable RLS on upvotes table
ALTER TABLE public.upvotes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for upvotes
CREATE POLICY "Allow all authenticated users to view upvotes"
  ON public.upvotes FOR SELECT
  USING (TRUE);

CREATE POLICY "Allow users to insert upvotes"
  ON public.upvotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own upvotes"
  ON public.upvotes FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_upvotes_issue_id ON public.upvotes(issue_id);
CREATE INDEX idx_upvotes_user_id ON public.upvotes(user_id);
