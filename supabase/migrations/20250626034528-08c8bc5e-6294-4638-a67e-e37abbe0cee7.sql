
-- Add a new column to store multiple possible answers as JSON array
ALTER TABLE masked_rider_images 
ADD COLUMN accepted_answers JSONB DEFAULT '[]'::jsonb;

-- Update existing records to move single answer to accepted_answers array
UPDATE masked_rider_images 
SET accepted_answers = jsonb_build_array(answer)
WHERE accepted_answers = '[]'::jsonb;

-- Add a check to ensure accepted_answers is always an array
ALTER TABLE masked_rider_images 
ADD CONSTRAINT check_accepted_answers_is_array 
CHECK (jsonb_typeof(accepted_answers) = 'array');
