-- Create comprehensive tagging system for issue categorization

-- Create tags table
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#6B7280',
    icon TEXT,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create issue_tags junction table (many-to-many)
CREATE TABLE IF NOT EXISTS public.issue_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(issue_id, tag_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_tags_name ON public.tags(name);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON public.tags(slug);
CREATE INDEX IF NOT EXISTS idx_tags_usage_count ON public.tags(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_issue_tags_issue_id ON public.issue_tags(issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_tags_tag_id ON public.issue_tags(tag_id);

-- Enable RLS
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_tags ENABLE ROW LEVEL SECURITY;

-- Tags policies
CREATE POLICY "Allow all authenticated users to view tags"
    ON public.tags FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow admins to insert tags"
    ON public.tags FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

CREATE POLICY "Allow admins to update tags"
    ON public.tags FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

-- Issue tags policies
CREATE POLICY "Allow all authenticated users to view issue tags"
    ON public.issue_tags FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow users to tag their own issues"
    ON public.issue_tags FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.issues
            WHERE issues.id = issue_tags.issue_id AND issues.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

CREATE POLICY "Allow users to remove tags from their own issues"
    ON public.issue_tags FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.issues
            WHERE issues.id = issue_tags.issue_id AND issues.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

-- Insert default tags
INSERT INTO public.tags (name, slug, description, color, icon) VALUES
    ('Urgent', 'urgent', 'Requires immediate attention', '#EF4444', '🚨'),
    ('High Priority', 'high-priority', 'Important but not urgent', '#F59E0B', '⚠️'),
    ('Verified', 'verified', 'Verified by authorities', '#10B981', '✓'),
    ('In Review', 'in-review', 'Under review by authorities', '#3B82F6', '👁️'),
    ('Needs Info', 'needs-info', 'Requires more information', '#8B5CF6', '❓'),
    ('Duplicate', 'duplicate', 'Duplicate of existing issue', '#6B7280', '📋'),
    ('Resolved Quickly', 'resolved-quickly', 'Resolved within 24 hours', '#059669', '⚡')
ON CONFLICT (slug) DO NOTHING;

-- Function to update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.tags SET usage_count = GREATEST(usage_count - 1, 0) WHERE id = OLD.tag_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update tag usage count
CREATE TRIGGER trigger_update_tag_usage_count
AFTER INSERT OR DELETE ON public.issue_tags
FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();
