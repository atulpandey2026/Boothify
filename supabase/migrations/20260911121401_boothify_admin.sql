-- Boothify Admin Panel Migration
-- Tables: clientele_logos, testimonials, gallery_photos, cities, contact_details, form_responses

-- ============================================================
-- 1. TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.clientele_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL DEFAULT '',
  website_url TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT DEFAULT '',
  author_company TEXT DEFAULT '',
  rating INTEGER DEFAULT 5,
  accent_color TEXT DEFAULT 'text-violet-600',
  bg_color TEXT DEFAULT 'bg-violet-50 border-violet-100',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT DEFAULT '',
  photo_url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  category TEXT DEFAULT 'general',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  emoji TEXT DEFAULT '🏙️',
  color TEXT DEFAULT '#7C3AED',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.contact_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_name TEXT NOT NULL DEFAULT 'Mr. Ankur Srivastava',
  contact_role TEXT DEFAULT 'Lead Contact — Boothify',
  phone TEXT DEFAULT '+91 79820 32246',
  email TEXT DEFAULT 'contact@boothify.in',
  address TEXT DEFAULT '',
  company TEXT DEFAULT 'Bharat Network Group',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.form_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  city TEXT DEFAULT '',
  event_type TEXT DEFAULT '',
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'new',
  admin_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_clientele_logos_active ON public.clientele_logos(is_active);
CREATE INDEX IF NOT EXISTS idx_clientele_logos_order ON public.clientele_logos(display_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON public.testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_active ON public.gallery_photos(is_active);
CREATE INDEX IF NOT EXISTS idx_cities_active ON public.cities(is_active);
CREATE INDEX IF NOT EXISTS idx_form_responses_status ON public.form_responses(status);
CREATE INDEX IF NOT EXISTS idx_form_responses_created ON public.form_responses(created_at);

-- ============================================================
-- 3. FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
  SELECT 1 FROM public.user_profiles up
  WHERE up.id = auth.uid() AND up.role = 'admin'
)
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- ============================================================
-- 4. ENABLE RLS
-- ============================================================

ALTER TABLE public.clientele_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_responses ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 5. RLS POLICIES
-- ============================================================

-- clientele_logos: public read, admin write
DROP POLICY IF EXISTS "public_read_clientele_logos" ON public.clientele_logos;
CREATE POLICY "public_read_clientele_logos" ON public.clientele_logos
FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_manage_clientele_logos" ON public.clientele_logos;
CREATE POLICY "admin_manage_clientele_logos" ON public.clientele_logos
FOR ALL TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- testimonials: public read, admin write
DROP POLICY IF EXISTS "public_read_testimonials" ON public.testimonials;
CREATE POLICY "public_read_testimonials" ON public.testimonials
FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_manage_testimonials" ON public.testimonials;
CREATE POLICY "admin_manage_testimonials" ON public.testimonials
FOR ALL TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- gallery_photos: public read, admin write
DROP POLICY IF EXISTS "public_read_gallery_photos" ON public.gallery_photos;
CREATE POLICY "public_read_gallery_photos" ON public.gallery_photos
FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_manage_gallery_photos" ON public.gallery_photos;
CREATE POLICY "admin_manage_gallery_photos" ON public.gallery_photos
FOR ALL TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- cities: public read, admin write
DROP POLICY IF EXISTS "public_read_cities" ON public.cities;
CREATE POLICY "public_read_cities" ON public.cities
FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_manage_cities" ON public.cities;
CREATE POLICY "admin_manage_cities" ON public.cities
FOR ALL TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- contact_details: public read, admin write
DROP POLICY IF EXISTS "public_read_contact_details" ON public.contact_details;
CREATE POLICY "public_read_contact_details" ON public.contact_details
FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_manage_contact_details" ON public.contact_details;
CREATE POLICY "admin_manage_contact_details" ON public.contact_details
FOR ALL TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- form_responses: public insert, admin read/manage
DROP POLICY IF EXISTS "public_insert_form_responses" ON public.form_responses;
CREATE POLICY "public_insert_form_responses" ON public.form_responses
FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "admin_manage_form_responses" ON public.form_responses;
CREATE POLICY "admin_manage_form_responses" ON public.form_responses
FOR ALL TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- ============================================================
-- 6. TRIGGERS
-- ============================================================

DROP TRIGGER IF EXISTS update_clientele_logos_updated_at ON public.clientele_logos;
CREATE TRIGGER update_clientele_logos_updated_at
  BEFORE UPDATE ON public.clientele_logos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_gallery_photos_updated_at ON public.gallery_photos;
CREATE TRIGGER update_gallery_photos_updated_at
  BEFORE UPDATE ON public.gallery_photos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_cities_updated_at ON public.cities;
CREATE TRIGGER update_cities_updated_at
  BEFORE UPDATE ON public.cities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_details_updated_at ON public.contact_details;
CREATE TRIGGER update_contact_details_updated_at
  BEFORE UPDATE ON public.contact_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_form_responses_updated_at ON public.form_responses;
CREATE TRIGGER update_form_responses_updated_at
  BEFORE UPDATE ON public.form_responses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 7. STORAGE BUCKETS (via SQL)
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('clientele-logos', 'clientele-logos', true, 5242880, ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('gallery-photos', 'gallery-photos', true, 10485760, ARRAY['image/png','image/jpeg','image/jpg','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for clientele-logos
DROP POLICY IF EXISTS "public_read_clientele_logos_storage" ON storage.objects;
CREATE POLICY "public_read_clientele_logos_storage" ON storage.objects
FOR SELECT TO public USING (bucket_id = 'clientele-logos');

DROP POLICY IF EXISTS "admin_upload_clientele_logos_storage" ON storage.objects;
CREATE POLICY "admin_upload_clientele_logos_storage" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'clientele-logos' AND public.is_admin_user());

DROP POLICY IF EXISTS "admin_delete_clientele_logos_storage" ON storage.objects;
CREATE POLICY "admin_delete_clientele_logos_storage" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'clientele-logos' AND public.is_admin_user());

-- Storage policies for gallery-photos
DROP POLICY IF EXISTS "public_read_gallery_photos_storage" ON storage.objects;
CREATE POLICY "public_read_gallery_photos_storage" ON storage.objects
FOR SELECT TO public USING (bucket_id = 'gallery-photos');

DROP POLICY IF EXISTS "admin_upload_gallery_photos_storage" ON storage.objects;
CREATE POLICY "admin_upload_gallery_photos_storage" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery-photos' AND public.is_admin_user());

DROP POLICY IF EXISTS "admin_delete_gallery_photos_storage" ON storage.objects;
CREATE POLICY "admin_delete_gallery_photos_storage" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'gallery-photos' AND public.is_admin_user());

-- ============================================================
-- 8. SEED DATA
-- ============================================================

DO $$
BEGIN
  -- Seed clientele logos
  INSERT INTO public.clientele_logos (name, logo_url, display_order, is_active) VALUES
    ('Tata Group', '', 1, true),
    ('Reliance Industries', '', 2, true),
    ('Infosys', '', 3, true),
    ('HDFC Bank', '', 4, true),
    ('Mahindra', '', 5, true),
    ('Wipro', '', 6, true),
    ('Bajaj Auto', '', 7, true),
    ('Maruti Suzuki', '', 8, true),
    ('ITC Limited', '', 9, true),
    ('Godrej Group', '', 10, true),
    ('Asian Paints', '', 11, true),
    ('Hindustan Unilever', '', 12, true)
  ON CONFLICT DO NOTHING;

  -- Seed testimonials
  INSERT INTO public.testimonials (quote, author_name, author_role, author_company, rating, accent_color, bg_color, display_order, is_active) VALUES
    ('Boothify transformed our exhibition presence completely. The booth they designed for us at India International Trade Fair was the talk of the event — we had 3x more footfall than previous years.', 'Rajesh Sharma', 'Head of Marketing', 'Tata Consumer Products', 5, 'text-violet-600', 'bg-violet-50 border-violet-100', 1, true),
    ('From concept to execution in just 3 weeks — the team at Boothify is incredibly professional. Our brand activation in Mumbai was flawless. Highly recommend for any large-scale event.', 'Priya Mehta', 'Brand Director', 'Reliance Retail', 5, 'text-pink-600', 'bg-pink-50 border-pink-100', 2, true),
    ('The stage production for our annual summit was world-class. Lighting, trussing, AV — everything was perfect. Boothify''s attention to detail is unmatched in the industry.', 'Arjun Kapoor', 'Events Manager', 'Infosys Limited', 5, 'text-emerald-600', 'bg-emerald-50 border-emerald-100', 3, true),
    ('We have worked with Boothify across 5 cities for our product launch roadshow. Consistent quality, on-time delivery, and a team that truly understands brand storytelling.', 'Sunita Agarwal', 'VP Marketing', 'HDFC Bank', 5, 'text-blue-600', 'bg-blue-50 border-blue-100', 4, true),
    ('Our Mahindra booth at Auto Expo was a showstopper. The custom fabrication quality was exceptional and the team managed everything on-site without a single hiccup.', 'Vikram Singh', 'Product Marketing Lead', 'Mahindra & Mahindra', 5, 'text-amber-600', 'bg-amber-50 border-amber-100', 5, true),
    ('Boothify delivered a stunning experiential zone for our Godrej activation. The creative team understood our brand DNA perfectly and brought it to life beautifully.', 'Meera Nair', 'Experiential Marketing Head', 'Godrej Group', 5, 'text-teal-600', 'bg-teal-50 border-teal-100', 6, true)
  ON CONFLICT DO NOTHING;

  -- Seed cities
  INSERT INTO public.cities (name, emoji, color, display_order, is_active) VALUES
    ('Delhi', '🏛️', '#7C3AED', 1, true),
    ('Noida', '🏢', '#EC4899', 2, true),
    ('Chandigarh', '🌺', '#F59E0B', 3, true),
    ('Lucknow', '🌹', '#06B6D4', 4, true),
    ('Jaipur', '🏰', '#D946EF', 5, true),
    ('Ahmedabad', '🏺', '#F97316', 6, true),
    ('Mumbai', '🌊', '#10B981', 7, true),
    ('Hyderabad', '💎', '#3B82F6', 8, true),
    ('Bengaluru', '🌿', '#8B5CF6', 9, true),
    ('Chennai', '🎭', '#EF4444', 10, true)
  ON CONFLICT (name) DO NOTHING;

  -- Seed contact details
  INSERT INTO public.contact_details (contact_name, contact_role, phone, email, company, is_active) VALUES
    ('Mr. Ankur Srivastava', 'Lead Contact — Boothify', '+91 79820 32246', 'contact@boothify.in', 'Bharat Network Group', true)
  ON CONFLICT DO NOTHING;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Seed data error: %', SQLERRM;
END $$;
