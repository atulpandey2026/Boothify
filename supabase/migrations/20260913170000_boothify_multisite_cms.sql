-- ============================================================
-- BOOTHIFY MULTI-SITE CMS ISOLATION
-- Keeps Boothify Hero/Portfolio data separate from BNG data
-- when both websites use the same Supabase project/database.
-- ============================================================

-- ------------------------------------------------------------
-- 1. HERO IMAGES
-- ------------------------------------------------------------
-- This table may already exist (including an older BNG version),
-- so ADD missing columns instead of relying on CREATE TABLE IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS public.hero_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT,
  alt_text TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  site TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.hero_images ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.hero_images ADD COLUMN IF NOT EXISTS alt_text TEXT DEFAULT '';
ALTER TABLE public.hero_images ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.hero_images ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.hero_images ADD COLUMN IF NOT EXISTS site TEXT;
ALTER TABLE public.hero_images ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.hero_images ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- Existing rows in this shared table were already being used by BNG.
-- Keep them assigned to BNG so the BNG website continues to show them.
UPDATE public.hero_images
SET site = 'bng'
WHERE site IS NULL;

CREATE INDEX IF NOT EXISTS idx_hero_images_site ON public.hero_images(site);
CREATE INDEX IF NOT EXISTS idx_hero_images_site_active_order
  ON public.hero_images(site, is_active, display_order);

ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_hero_images" ON public.hero_images;
CREATE POLICY "public_read_hero_images" ON public.hero_images
FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_manage_hero_images" ON public.hero_images;
CREATE POLICY "admin_manage_hero_images" ON public.hero_images
FOR ALL TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

DROP TRIGGER IF EXISTS update_hero_images_updated_at ON public.hero_images;
CREATE TRIGGER update_hero_images_updated_at
  BEFORE UPDATE ON public.hero_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Boothify seed images are inserted only if Boothify currently has none.
INSERT INTO public.hero_images
  (image_url, alt_text, display_order, is_active, site)
SELECT * FROM (VALUES
  ('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&auto=format&fit=crop&q=80', 'Large conference stage with dramatic lighting, speaker podium and thousands of attendees in a grand arena', 1, true, 'boothify'),
  ('https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&auto=format&fit=crop&q=80', 'Modern exhibition booth interior with bright lighting, branded display walls and professional setup', 2, true, 'boothify'),
  ('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&auto=format&fit=crop&q=80', 'Concert stage with confetti explosion, vivid colored lights and massive crowd in dark arena atmosphere', 3, true, 'boothify'),
  ('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&auto=format&fit=crop&q=80', 'Elegant ballroom event with chandeliers, warm golden lighting and beautifully decorated tables for gala', 4, true, 'boothify')
) AS seed(image_url, alt_text, display_order, is_active, site)
WHERE NOT EXISTS (
  SELECT 1 FROM public.hero_images WHERE site = 'boothify'
);

-- ------------------------------------------------------------
-- 2. PORTFOLIO / OUR FINEST WORK
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'experiences',
  category_label TEXT NOT NULL DEFAULT 'Experience',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  site TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.portfolio_items ADD COLUMN IF NOT EXISTS site TEXT;

-- Portfolio table was introduced for Boothify, so existing rows belong to Boothify.
UPDATE public.portfolio_items
SET site = 'boothify'
WHERE site IS NULL;

CREATE INDEX IF NOT EXISTS idx_portfolio_items_site ON public.portfolio_items(site);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_site_active_order
  ON public.portfolio_items(site, is_active, display_order);

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_portfolio_items" ON public.portfolio_items;
CREATE POLICY "public_read_portfolio_items" ON public.portfolio_items
FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_manage_portfolio_items" ON public.portfolio_items;
CREATE POLICY "admin_manage_portfolio_items" ON public.portfolio_items
FOR ALL TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

DROP TRIGGER IF EXISTS update_portfolio_items_updated_at ON public.portfolio_items;
CREATE TRIGGER update_portfolio_items_updated_at
  BEFORE UPDATE ON public.portfolio_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Reload PostgREST schema cache so the new site column is immediately visible.
NOTIFY pgrst, 'reload schema';
