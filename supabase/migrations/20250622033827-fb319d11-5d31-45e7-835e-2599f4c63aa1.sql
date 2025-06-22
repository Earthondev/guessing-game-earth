
-- Create storage bucket for category cover images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('category-covers', 'category-covers', true);

-- Create storage policies for category covers
CREATE POLICY "Allow public uploads to category-covers" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'category-covers');

CREATE POLICY "Allow public reads from category-covers" ON storage.objects 
FOR SELECT USING (bucket_id = 'category-covers');

CREATE POLICY "Allow public deletes from category-covers" ON storage.objects 
FOR DELETE USING (bucket_id = 'category-covers');

-- Create table for game categories
CREATE TABLE public.game_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🎮',
  cover_image_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on the table
ALTER TABLE public.game_categories ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to categories
CREATE POLICY "Allow public read access to categories" 
ON public.game_categories 
FOR SELECT 
USING (true);

-- Create policy to allow authenticated users to manage categories (simplified for now)
CREATE POLICY "Allow authenticated users to manage categories" 
ON public.game_categories 
FOR ALL 
USING (true);

-- Update the masked_rider_images table to reference categories
ALTER TABLE public.masked_rider_images 
ADD COLUMN category_id UUID REFERENCES public.game_categories(id);

-- Create index for better performance
CREATE INDEX idx_masked_rider_images_category_id ON public.masked_rider_images (category_id);
