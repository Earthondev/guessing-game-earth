
-- Add the missing original_storage_path column to the masked_rider_images table
ALTER TABLE public.masked_rider_images 
ADD COLUMN original_storage_path text;

-- Update the table to support categories/modes for the expanded platform
ALTER TABLE public.masked_rider_images 
ADD COLUMN category text NOT NULL DEFAULT 'masked_rider';

-- Create an index for better performance when querying by category
CREATE INDEX idx_masked_rider_images_category ON public.masked_rider_images (category);
