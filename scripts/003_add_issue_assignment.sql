-- Add issue assignment and authority management

-- Create authorities table
CREATE TABLE IF NOT EXISTS public.authorities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    address TEXT,
    jurisdiction_area TEXT,
    categories TEXT[], -- Array of categories they handle
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create issue assignments table
CREATE TABLE IF NOT EXISTS public.issue_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    authority_id UUID NOT NULL REFERENCES public.authorities(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    status TEXT DEFAULT 'assigned',
    UNIQUE(issue_id, authority_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_authorities_department ON public.authorities(department);
CREATE INDEX IF NOT EXISTS idx_authorities_is_active ON public.authorities(is_active);
CREATE INDEX IF NOT EXISTS idx_issue_assignments_issue_id ON public.issue_assignments(issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_assignments_authority_id ON public.issue_assignments(authority_id);

-- Enable RLS
ALTER TABLE public.authorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_assignments ENABLE ROW LEVEL SECURITY;

-- Authorities policies
CREATE POLICY "Allow all authenticated users to view authorities"
    ON public.authorities FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow admins to manage authorities"
    ON public.authorities FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

-- Issue assignments policies
CREATE POLICY "Allow all authenticated users to view assignments"
    ON public.issue_assignments FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow admins to create assignments"
    ON public.issue_assignments FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

-- Insert sample authorities
INSERT INTO public.authorities (name, department, email, categories) VALUES
    ('Freetown City Council', 'Public Works', 'public.works@fcc.gov.sl', ARRAY['infrastructure', 'roads']),
    ('National Water Authority', 'Water Services', 'info@nwa.gov.sl', ARRAY['sanitation', 'water']),
    ('Sierra Leone Road Safety Authority', 'Transportation', 'info@slrsa.gov.sl', ARRAY['safety', 'infrastructure']),
    ('Ministry of Energy', 'Power & Energy', 'info@energy.gov.sl', ARRAY['utilities', 'infrastructure'])
ON CONFLICT (email) DO NOTHING;
