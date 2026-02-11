-- Create leaderboard table
CREATE TABLE IF NOT EXISTS public.leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  total_questions INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read leaderboard
CREATE POLICY "Anyone can view leaderboard"
  ON public.leaderboard
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anyone to insert scores (no auth required for players)
CREATE POLICY "Anyone can insert scores"
  ON public.leaderboard
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_category_score
  ON public.leaderboard (category, score DESC);

CREATE INDEX IF NOT EXISTS idx_leaderboard_created_at
  ON public.leaderboard (created_at DESC);
