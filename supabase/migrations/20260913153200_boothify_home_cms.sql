-- Boothify Home Page CMS Extension
-- Adds dynamic Hero Images and Our Finest Work, and connects Gallery to Home Page.
-- This migration is additive and does NOT remove or modify existing content tables.

-- ============================================================
-- 1. HERO IMAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.hero_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hero_images_active ON public.hero_images(is_active);
CREATE INDEX IF NOT EXISTS idx_hero_images_order ON public.hero_images(display_order);

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

-- ============================================================
-- 2. OUR FINEST WORK / PORTFOLIO
-- ============================================================

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
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_portfolio_items_active ON public.portfolio_items(is_active);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_order ON public.portfolio_items(display_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_category ON public.portfolio_items(category);

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

-- ============================================================
-- 3. STORAGE BUCKETS
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('hero-images', 'hero-images', true, 15728640, ARRAY['image/png','image/jpeg','image/jpg','image/webp'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 15728640, allowed_mime_types = ARRAY['image/png','image/jpeg','image/jpg','image/webp'];

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('portfolio-images', 'portfolio-images', true, 10485760, ARRAY['image/png','image/jpeg','image/jpg','image/webp'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 10485760, allowed_mime_types = ARRAY['image/png','image/jpeg','image/jpg','image/webp'];

-- Public read policies are required for the Home Page to display uploaded images.
DROP POLICY IF EXISTS "public_read_hero_images_storage" ON storage.objects;
CREATE POLICY "public_read_hero_images_storage" ON storage.objects
FOR SELECT TO public USING (bucket_id = 'hero-images');

DROP POLICY IF EXISTS "admin_upload_hero_images_storage" ON storage.objects;
CREATE POLICY "admin_upload_hero_images_storage" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'hero-images' AND public.is_admin_user());

DROP POLICY IF EXISTS "admin_update_hero_images_storage" ON storage.objects;
CREATE POLICY "admin_update_hero_images_storage" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'hero-images' AND public.is_admin_user()) WITH CHECK (bucket_id = 'hero-images' AND public.is_admin_user());

DROP POLICY IF EXISTS "admin_delete_hero_images_storage" ON storage.objects;
CREATE POLICY "admin_delete_hero_images_storage" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'hero-images' AND public.is_admin_user());

DROP POLICY IF EXISTS "public_read_portfolio_images_storage" ON storage.objects;
CREATE POLICY "public_read_portfolio_images_storage" ON storage.objects
FOR SELECT TO public USING (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "admin_upload_portfolio_images_storage" ON storage.objects;
CREATE POLICY "admin_upload_portfolio_images_storage" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-images' AND public.is_admin_user());

DROP POLICY IF EXISTS "admin_update_portfolio_images_storage" ON storage.objects;
CREATE POLICY "admin_update_portfolio_images_storage" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-images' AND public.is_admin_user()) WITH CHECK (bucket_id = 'portfolio-images' AND public.is_admin_user());

DROP POLICY IF EXISTS "admin_delete_portfolio_images_storage" ON storage.objects;
CREATE POLICY "admin_delete_portfolio_images_storage" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'portfolio-images' AND public.is_admin_user());

-- ============================================================
-- 4. PRESERVE THE EXISTING HERO IMAGES
-- ============================================================
-- These are the four images already used by the website. They are inserted only
-- when the new table is empty, so running this migration cannot duplicate them.

INSERT INTO public.hero_images (image_url, alt_text, display_order, is_active)
SELECT * FROM (VALUES
  ('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&auto=format&fit=crop&q=80', 'Large conference stage with dramatic lighting, speaker podium and thousands of attendees in a grand arena', 1, true),
  ('https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&auto=format&fit=crop&q=80', 'Modern exhibition booth interior with bright lighting, branded display walls and professional setup', 2, true),
  ('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&auto=format&fit=crop&q=80', 'Concert stage with confetti explosion, vivid colored lights and massive crowd in dark arena atmosphere', 3, true),
  ('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&auto=format&fit=crop&q=80', 'Elegant ballroom event with chandeliers, warm golden lighting and beautifully decorated tables for gala', 4, true)
) AS seed(image_url, alt_text, display_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM public.hero_images);

-- ============================================================
-- 5. PRESERVE THE EXISTING OUR FINEST WORK CONTENT
-- ============================================================
-- These are the nine existing hard-coded portfolio cards. They become editable
-- in the new admin panel without removing the original content/images.

INSERT INTO public.portfolio_items (title, description, image_url, alt_text, category, category_label, display_order, is_active)
SELECT * FROM (VALUES
  ('Concert Night Production', '', 'https://images.unsplash.com/photo-1720292060310-c7a938601ae6', 'Concert stage with vivid colored lights, smoke effects and large crowd in dark arena', 'stages', 'Stage', 1, true),
  ('Tech Expo Pavilion', '', 'https://img.rocket.new/generatedImages/rocket_gen_img_15bf5c87e-1772256249267.png', 'Bright exhibition hall with large conference booth pavilions and business visitors', 'booths', 'Booth', 2, true),
  ('International Trade Expo Booth', '', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800', 'Modern trade show exhibition booth with branded panels and product displays in well-lit expo hall', 'booths', 'Booth', 3, true),
  ('Grand Ballroom Gala', '', 'https://images.unsplash.com/photo-1713096591935-a506ca209159', 'Elegant ballroom event with chandeliers, warm golden lighting and decorated tables for gala event', 'mezzanines', 'Mezzanine', 4, true),
  ('Brand Activation Hub', '', 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Vibrant brand activation space with colourful interactive displays and engaged consumers', 'experiences', 'Experience', 5, true),
  ('Summit Leadership Forum', '', 'https://img.rocket.new/generatedImages/rocket_gen_img_1448ec0fc-1772647999669.png', 'Professional conference stage with speaker podium, dramatic lighting and large audience in dark auditorium', 'stages', 'Stage', 6, true),
  ('Executive Lounge Design', '', 'https://images.unsplash.com/photo-1662261896074-2c455242bb9a', 'Sophisticated executive lounge with modern furniture, ambient lighting and premium interior design', 'mezzanines', 'Mezzanine', 7, true),
  ('Immersive Brand World', '', 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=800', 'Immersive brand experience installation with glowing neon elements and interactive digital displays', 'experiences', 'Experience', 8, true),
  ('Custom Stall Fabrication', '', 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800', 'Precision-engineered custom stall structure with backlit panels and branded signage at expo', 'booths', 'Booth', 9, true)
) AS seed(title, description, image_url, alt_text, category, category_label, display_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM public.portfolio_items);

-- ============================================================
-- 6. KEEP GALLERY PUBLICLY READABLE
-- ============================================================
-- Existing gallery_photos data is not changed. The Home Page now reads active
-- gallery_photos rows ordered by display_order.

DROP POLICY IF EXISTS "public_read_gallery_photos" ON public.gallery_photos;
CREATE POLICY "public_read_gallery_photos" ON public.gallery_photos
FOR SELECT TO public USING (true);
