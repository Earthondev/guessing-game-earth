-- Drop existing authenticated policies
DROP POLICY IF EXISTS "Authenticated insert for game_categories" ON public.game_categories;
DROP POLICY IF EXISTS "Authenticated update for game_categories" ON public.game_categories;
DROP POLICY IF EXISTS "Authenticated delete for game_categories" ON public.game_categories;

DROP POLICY IF EXISTS "Authenticated insert for masked_rider_images" ON public.masked_rider_images;
DROP POLICY IF EXISTS "Authenticated update for masked_rider_images" ON public.masked_rider_images;
DROP POLICY IF EXISTS "Authenticated delete for masked_rider_images" ON public.masked_rider_images;

DROP POLICY IF EXISTS "Authenticated Upload for objects" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update for objects" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete for objects" ON storage.objects;

-- Create Open (Public) Write Policies
-- game_categories
CREATE POLICY "Public insert for game_categories" ON public.game_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update for game_categories" ON public.game_categories FOR UPDATE USING (true);
CREATE POLICY "Public delete for game_categories" ON public.game_categories FOR DELETE USING (true);

-- masked_rider_images
CREATE POLICY "Public insert for masked_rider_images" ON public.masked_rider_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update for masked_rider_images" ON public.masked_rider_images FOR UPDATE USING (true);
CREATE POLICY "Public delete for masked_rider_images" ON public.masked_rider_images FOR DELETE USING (true);

-- Storage Policies (objects)
CREATE POLICY "Public Upload for objects" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('category-covers', 'masked-rider-images'));
CREATE POLICY "Public Update for objects" ON storage.objects FOR UPDATE USING (bucket_id IN ('category-covers', 'masked-rider-images'));
CREATE POLICY "Public Delete for objects" ON storage.objects FOR DELETE USING (bucket_id IN ('category-covers', 'masked-rider-images'));
