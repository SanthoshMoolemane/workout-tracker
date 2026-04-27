-- ============================================================
-- Workout Progressive Overload Tracker — Database Schema
-- Run this once in Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Exercises ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exercises (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR NOT NULL,
  muscle_group VARCHAR NOT NULL,
  rep_target   VARCHAR,
  is_custom    BOOLEAN NOT NULL DEFAULT false,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  day_index    INTEGER NOT NULL CHECK (day_index BETWEEN 0 AND 5),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Workout Sessions ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workout_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_index   INTEGER NOT NULL CHECK (day_index BETWEEN 0 AND 5),
  week_number INTEGER NOT NULL,
  year        INTEGER NOT NULL,
  date        DATE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, day_index, week_number, year)
);

-- ── Exercise Logs ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exercise_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id  UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  set1_weight  DECIMAL(6,2),
  set1_reps    INTEGER,
  set2_weight  DECIMAL(6,2),
  set2_reps    INTEGER,
  set3_weight  DECIMAL(6,2),
  set3_reps    INTEGER,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (session_id, exercise_id)
);

-- ── RLS Policies ──────────────────────────────────────────────
ALTER TABLE exercises       ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs   ENABLE ROW LEVEL SECURITY;

-- Exercises: all authenticated users can read predefined; users manage their own custom
CREATE POLICY "exercises_read" ON exercises
  FOR SELECT TO authenticated
  USING (is_custom = false OR user_id = auth.uid());

CREATE POLICY "exercises_insert" ON exercises
  FOR INSERT TO authenticated
  WITH CHECK (is_custom = true AND user_id = auth.uid());

CREATE POLICY "exercises_delete" ON exercises
  FOR DELETE TO authenticated
  USING (user_id = auth.uid() AND is_custom = true);

-- Workout sessions: own data only
CREATE POLICY "sessions_read" ON workout_sessions
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "sessions_insert" ON workout_sessions
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "sessions_update" ON workout_sessions
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Exercise logs: own data via sessions
CREATE POLICY "logs_read" ON exercise_logs
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM workout_sessions s WHERE s.id = session_id AND s.user_id = auth.uid()));
CREATE POLICY "logs_insert" ON exercise_logs
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM workout_sessions s WHERE s.id = session_id AND s.user_id = auth.uid()));
CREATE POLICY "logs_update" ON exercise_logs
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM workout_sessions s WHERE s.id = session_id AND s.user_id = auth.uid()));
CREATE POLICY "logs_delete" ON exercise_logs
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM workout_sessions s WHERE s.id = session_id AND s.user_id = auth.uid()));

-- ── Seed Predefined Exercises ──────────────────────────────────
-- Day 0: Push A (Monday)
INSERT INTO exercises (name, muscle_group, rep_target, is_custom, user_id, day_index) VALUES
('Barbell Bench Press',           'Chest',            '5–8',          false, NULL, 0),
('Incline Dumbbell Press',        'Chest',            '6–10',         false, NULL, 0),
('Cable Chest Fly',               'Chest',            '10–15',        false, NULL, 0),
('Seated Dumbbell Shoulder Press','Shoulders',        '6–10',         false, NULL, 0),
('Dumbbell Lateral Raise',        'Shoulders',        '12–15',        false, NULL, 0),
('Cable Triceps Pushdown',        'Triceps',          '10–15',        false, NULL, 0),

-- Day 1: Pull A (Tuesday)
('Pull-Ups / Lat Pulldown',       'Back',             '6–10',         false, NULL, 1),
('Barbell Row',                   'Back',             '6–10',         false, NULL, 1),
('Seated Cable Row',              'Back',             '8–12',         false, NULL, 1),
('Face Pull',                     'Rear Delts',       '12–15',        false, NULL, 1),
('Barbell Curl',                  'Biceps',           '8–12',         false, NULL, 1),
('Hammer Curl',                   'Biceps / Forearms','10–12',        false, NULL, 1),

-- Day 2: Legs A + Core (Wednesday)
('Back Squat',                    'Quads',            '5–8',          false, NULL, 2),
('Romanian Deadlift',             'Hamstrings',       '6–10',         false, NULL, 2),
('Leg Extension',                 'Quads',            '10–15',        false, NULL, 2),
('Seated Leg Curl',               'Hamstrings',       '10–15',        false, NULL, 2),
('Standing Calf Raise',           'Calves',           '12–20',        false, NULL, 2),
('Plank',                         'Core',             '30–60 sec',    false, NULL, 2),
('Hanging Knee Raise',            'Core',             '12–15',        false, NULL, 2),

-- Day 3: Push B (Thursday)
('Weighted Dips / Chest Dips',    'Chest',            '6–10',         false, NULL, 3),
('Incline Barbell Press',         'Chest',            '6–10',         false, NULL, 3),
('Cable Fly (low-to-high)',        'Chest',            '10–15',        false, NULL, 3),
('Machine Shoulder Press',        'Shoulders',        '6–10',         false, NULL, 3),
('Lateral Raise (Cable)',         'Shoulders',        '12–15',        false, NULL, 3),
('Overhead Cable Triceps Ext',    'Triceps',          '10–15',        false, NULL, 3),

-- Day 4: Pull B (Friday)
('Lat Pulldown (wide grip)',       'Back',             '6–10',         false, NULL, 4),
('Chest Supported Row',           'Back',             '6–10',         false, NULL, 4),
('Straight Arm Lat Pulldown',     'Back',             '10–12',        false, NULL, 4),
('Reverse Pec Deck',              'Rear Delts',       '12–15',        false, NULL, 4),
('Incline Dumbbell Curl',         'Biceps',           '8–12',         false, NULL, 4),
('Wrist Curl (Forearms)',         'Forearms',         '12–15',        false, NULL, 4),

-- Day 5: Legs B + Core (Saturday)
('Leg Press',                     'Quads',            '6–10',         false, NULL, 5),
('Romanian Deadlift',             'Hamstrings',       '6–10',         false, NULL, 5),
('Walking Lunges',                'Quads / Glutes',   '10–12 each leg',false, NULL, 5),
('Leg Curl',                      'Hamstrings',       '10–15',        false, NULL, 5),
('Seated Calf Raise',             'Calves',           '12–20',        false, NULL, 5),
('Cable Crunch',                  'Core',             '12–15',        false, NULL, 5),
('Ab Wheel / Rollout',            'Core',             '8–12',         false, NULL, 5);
