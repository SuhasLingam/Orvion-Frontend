-- ==============================================================================
-- ORVION - GAMIFIED DASHBOARD SUPABASE SCHEMA
-- ==============================================================================

-- 1. PROFILES (Extends Supabase Auth)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name text,
  email text UNIQUE NOT NULL,
  program text DEFAULT 'Full-Stack Developer',
  program_id text DEFAULT 'fsd',
  level integer DEFAULT 1,
  xp integer DEFAULT 0,
  xp_to_next_level integer DEFAULT 500,
  streak integer DEFAULT 0,
  readiness_score integer DEFAULT 15,
  joined_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. LEARNING PATH NODES
CREATE TABLE public.learning_nodes (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  xp_reward integer DEFAULT 50,
  type text CHECK (type IN ('video', 'quiz', 'project', 'interview')),
  duration text,
  order_index integer NOT NULL
);

-- User Progress on Learning Path
CREATE TABLE public.user_learning_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  node_id text REFERENCES public.learning_nodes(id) ON DELETE CASCADE,
  status text CHECK (status IN ('locked', 'active', 'completed')) DEFAULT 'locked',
  completed_at timestamp with time zone,
  UNIQUE(user_id, node_id)
);

-- 3. PROJECTS
CREATE TABLE public.projects (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  difficulty text CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  tech_stack text[]
);

CREATE TABLE public.user_projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id text REFERENCES public.projects(id) ON DELETE CASCADE,
  status text CHECK (status IN ('locked', 'in_progress', 'completed')) DEFAULT 'locked',
  progress integer DEFAULT 0,
  code_quality integer DEFAULT 0,
  completed_at timestamp with time zone,
  UNIQUE(user_id, project_id)
);

-- 4. TESTS & ASSESSMENTS
CREATE TABLE public.tests (
  id text PRIMARY KEY,
  title text NOT NULL,
  max_score integer DEFAULT 100,
  duration text
);

CREATE TABLE public.user_tests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  test_id text REFERENCES public.tests(id) ON DELETE CASCADE,
  status text CHECK (status IN ('pending', 'completed')) DEFAULT 'pending',
  score integer DEFAULT 0,
  completed_at timestamp with time zone,
  topics jsonb -- Stores array of { topic: 'React', score: 85 }
);

-- 5. MOCK INTERVIEWS
CREATE TABLE public.user_interviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  date text NOT NULL,
  overall_score integer NOT NULL,
  technical_score integer NOT NULL,
  communication_score integer NOT NULL,
  problem_solving_score integer NOT NULL,
  clarity_score integer NOT NULL,
  feedback text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.interview_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  interview_id uuid REFERENCES public.user_interviews(id) ON DELETE CASCADE,
  question text NOT NULL,
  level text CHECK (level IN ('Easy', 'Medium', 'Hard')),
  result text CHECK (result IN ('Correct', 'Partial', 'Incorrect')),
  llm_comment text
);

-- 6. BADGES & ACHIEVEMENTS
CREATE TABLE public.badges (
  id text PRIMARY KEY,
  title text NOT NULL,
  icon text NOT NULL,
  rarity text CHECK (rarity IN ('common', 'rare', 'epic', 'legendary'))
);

CREATE TABLE public.user_badges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id text REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, badge_id)
);

-- 7. ACTIVITY (For Heatmap)
CREATE TABLE public.user_activity (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  date date DEFAULT current_date,
  activity_count integer DEFAULT 1,
  UNIQUE(user_id, date)
);

CREATE TABLE public.payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  program_id text NOT NULL,
  amount integer NOT NULL,
  status text DEFAULT 'success',
  created_at timestamp with time zone DEFAULT now()
);


-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Global read access for static template tables
CREATE POLICY "Anyone can view learning nodes" ON public.learning_nodes FOR SELECT USING (true);
CREATE POLICY "Anyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Anyone can view tests" ON public.tests FOR SELECT USING (true);
CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (true);

-- User-specific access for progress tables
CREATE POLICY "Users view own learning progress" ON public.user_learning_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own learning progress" ON public.user_learning_progress FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users view own projects" ON public.user_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own projects" ON public.user_projects FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users view own tests" ON public.user_tests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own tests" ON public.user_tests FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users view own interviews" ON public.user_interviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own interviews" ON public.user_interviews FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users view own interview qs" ON public.interview_questions FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_interviews WHERE id = interview_id AND user_id = auth.uid()));
CREATE POLICY "Users manage own interview qs" ON public.interview_questions FOR ALL USING (EXISTS (SELECT 1 FROM public.user_interviews WHERE id = interview_id AND user_id = auth.uid()));

CREATE POLICY "Users view own badges" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own badges" ON public.user_badges FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users view own activity" ON public.user_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own activity" ON public.user_activity FOR ALL USING (auth.uid() = user_id);

-- Allow dynamic creation of template nodes/projects if they don't exist
CREATE POLICY "Anyone can insert learning nodes" ON public.learning_nodes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update learning nodes" ON public.learning_nodes FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert projects template" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update projects template" ON public.projects FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert tests template" ON public.tests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update tests template" ON public.tests FOR UPDATE USING (true);

-- Payment policies
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);
