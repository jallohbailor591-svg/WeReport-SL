-- Add database indexes for optimal query performance

-- Issues table indexes
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON public.issues(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issues_upvotes ON public.issues(upvotes DESC);
CREATE INDEX IF NOT EXISTS idx_issues_status ON public.issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_category ON public.issues(category);
CREATE INDEX IF NOT EXISTS idx_issues_user_id ON public.issues(user_id);
CREATE INDEX IF NOT EXISTS idx_issues_status_upvotes ON public.issues(status, upvotes DESC);
CREATE INDEX IF NOT EXISTS idx_issues_category_status ON public.issues(category, status);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_issues_status_created_at ON public.issues(status, created_at DESC);

-- Full-text search index on title and description
CREATE INDEX IF NOT EXISTS idx_issues_search ON public.issues USING gin(to_tsvector('english', title || ' ' || description));

-- Comments indexes
CREATE INDEX IF NOT EXISTS idx_comments_issue_id ON public.comments(issue_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_issue_created ON public.comments(issue_id, created_at DESC);

-- Upvotes indexes
CREATE INDEX IF NOT EXISTS idx_upvotes_issue_id ON public.upvotes(issue_id);
CREATE INDEX IF NOT EXISTS idx_upvotes_user_id ON public.upvotes(user_id);
CREATE INDEX IF NOT EXISTS idx_upvotes_user_issue ON public.upvotes(user_id, issue_id);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);

-- Performance: Analyze tables after creating indexes
ANALYZE public.issues;
ANALYZE public.comments;
ANALYZE public.upvotes;
ANALYZE public.notifications;
ANALYZE public.profiles;
