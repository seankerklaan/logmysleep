-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    badge_name TEXT NOT NULL,
    badge_description TEXT NOT NULL,
    badge_icon TEXT NOT NULL,
    day_earned INTEGER NOT NULL,
    earned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_name)
);

-- Enable RLS
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Policies for user_badges
CREATE POLICY "Users can view own badges"
    ON user_badges FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert badges"
    ON user_badges FOR INSERT
    WITH CHECK (true);  -- Only allowed via server-side functions

-- Add challenge_start_date to profiles
ALTER TABLE profiles
ADD COLUMN challenge_start_date DATE;