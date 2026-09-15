-- ============================================================
-- BOOTHIFY EVENT UPDATES / HERO EVENT CARD
-- ============================================================

CREATE TABLE IF NOT EXISTS public.event_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    event_date TEXT NOT NULL,
    location TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    site TEXT DEFAULT 'boothify',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.event_updates ADD COLUMN IF NOT EXISTS event_name TEXT;
ALTER TABLE public.event_updates ADD COLUMN IF NOT EXISTS event_date TEXT;
ALTER TABLE public.event_updates ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.event_updates ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.event_updates ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.event_updates ADD COLUMN IF NOT EXISTS site TEXT;
ALTER TABLE public.event_updates ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.event_updates ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

UPDATE public.event_updates SET site = 'boothify' WHERE site IS NULL;

CREATE INDEX IF NOT EXISTS idx_event_updates_site
ON public.event_updates(site);

CREATE INDEX IF NOT EXISTS idx_event_updates_site_active_order
ON public.event_updates(site, is_active, display_order);

ALTER TABLE public.event_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_event_updates" ON public.event_updates;
CREATE POLICY "public_read_event_updates"
ON public.event_updates
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "admin_manage_event_updates" ON public.event_updates;
CREATE POLICY "admin_manage_event_updates"
ON public.event_updates
FOR ALL
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

INSERT INTO public.event_updates
(event_name, event_date, location, display_order, is_active, site)
SELECT seed.event_name, seed.event_date, seed.location, seed.display_order, true, 'boothify'
FROM (
    VALUES
    ('Event Name 1', 'Date', 'Location', 1),
    ('Event Name 2', 'Date', 'Location', 2),
    ('Event Name 3', 'Date', 'Location', 3)
) AS seed(event_name, event_date, location, display_order)
WHERE NOT EXISTS (
    SELECT 1 FROM public.event_updates WHERE site = 'boothify'
);

NOTIFY pgrst, 'reload schema';
