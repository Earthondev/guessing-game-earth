
-- Create storage bucket for masked rider images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('masked-rider-images', 'masked-rider-images', true);

-- Create storage policy to allow public uploads
CREATE POLICY "Allow public uploads" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'masked-rider-images');

-- Create storage policy to allow public reads
CREATE POLICY "Allow public reads" ON storage.objects 
FOR SELECT USING (bucket_id = 'masked-rider-images');

-- Create storage policy to allow public deletes
CREATE POLICY "Allow public deletes" ON storage.objects 
FOR DELETE USING (bucket_id = 'masked-rider-images');

-- Create table for masked rider images metadata
CREATE TABLE public.masked_rider_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on the table
ALTER TABLE public.masked_rider_images ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public access (since it's a game, no authentication needed)
CREATE POLICY "Allow public access to masked rider images" 
ON public.masked_rider_images 
FOR ALL 
USING (true);
