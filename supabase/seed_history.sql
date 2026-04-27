-- ============================================================
-- Historical workout data seed — Santhosh's sessions Mar–Apr 2026
-- ============================================================
-- HOW TO USE:
--   1. Log in to the app at least once so your user row exists in auth.users
--   2. In Supabase → SQL Editor, run:
--        SELECT id FROM auth.users LIMIT 1;
--      Copy the UUID shown.
--   3. Replace 'YOUR-USER-ID-HERE' below with that UUID.
--   4. Run this script.
-- ============================================================

DO $$
DECLARE
  v_uid  UUID := '097a8653-544b-467a-9eb5-a691023db29e';
  sid    UUID;

  -- Day 0 (Push A) exercises
  ex_bench      UUID;
  ex_incl_db    UUID;
  ex_cable_fly  UUID;
  ex_db_press   UUID;
  ex_lat_raise  UUID;
  ex_tri_push   UUID;

  -- Day 1 (Pull A) exercises
  ex_pullup     UUID;
  ex_bb_row     UUID;
  ex_cable_row  UUID;
  ex_face_pull  UUID;
  ex_bb_curl    UUID;
  ex_hammer     UUID;

  -- Day 2 (Legs A) exercises
  ex_squat      UUID;
  ex_rdl_a      UUID;
  ex_leg_ext    UUID;
  ex_leg_curl_s UUID;
  ex_calf_s     UUID;
  ex_plank      UUID;
  ex_knee_raise UUID;

  -- Day 3 (Push B) exercises
  ex_dips       UUID;
  ex_incl_bb    UUID;
  ex_cable_lh   UUID;
  ex_mach_sh    UUID;
  ex_lat_cable  UUID;
  ex_tri_ext    UUID;

  -- Day 4 (Pull B) exercises
  ex_lat_pull   UUID;
  ex_cs_row     UUID;
  ex_sa_pull    UUID;
  ex_rev_pec    UUID;
  ex_incl_curl  UUID;

  -- Day 5 (Legs B) exercises
  ex_leg_press  UUID;
  ex_rdl_b      UUID;
  ex_lunge      UUID;
  ex_leg_curl_b UUID;
  ex_calf_b     UUID;
  ex_cable_crnch UUID;
  ex_ab_wheel   UUID;

BEGIN

  -- ── Resolve exercise IDs by name ──────────────────────────
  SELECT id INTO ex_bench      FROM exercises WHERE name = 'Barbell Bench Press'            AND is_custom = false;
  SELECT id INTO ex_incl_db    FROM exercises WHERE name = 'Incline Dumbbell Press'         AND is_custom = false;
  SELECT id INTO ex_cable_fly  FROM exercises WHERE name = 'Cable Chest Fly'                AND is_custom = false;
  SELECT id INTO ex_db_press   FROM exercises WHERE name = 'Seated Dumbbell Shoulder Press' AND is_custom = false;
  SELECT id INTO ex_lat_raise  FROM exercises WHERE name = 'Dumbbell Lateral Raise'         AND is_custom = false;
  SELECT id INTO ex_tri_push   FROM exercises WHERE name = 'Cable Triceps Pushdown'         AND is_custom = false;

  SELECT id INTO ex_pullup     FROM exercises WHERE name = 'Pull-Ups / Lat Pulldown'        AND is_custom = false;
  SELECT id INTO ex_bb_row     FROM exercises WHERE name = 'Barbell Row'                    AND is_custom = false;
  SELECT id INTO ex_cable_row  FROM exercises WHERE name = 'Seated Cable Row'               AND is_custom = false;
  SELECT id INTO ex_face_pull  FROM exercises WHERE name = 'Face Pull'                      AND is_custom = false;
  SELECT id INTO ex_bb_curl    FROM exercises WHERE name = 'Barbell Curl'                   AND is_custom = false;
  SELECT id INTO ex_hammer     FROM exercises WHERE name = 'Hammer Curl'                    AND is_custom = false;

  SELECT id INTO ex_squat      FROM exercises WHERE name = 'Back Squat'                     AND is_custom = false;
  SELECT id INTO ex_rdl_a      FROM exercises WHERE name = 'Romanian Deadlift' AND day_index = 2;
  SELECT id INTO ex_leg_ext    FROM exercises WHERE name = 'Leg Extension'                  AND is_custom = false;
  SELECT id INTO ex_leg_curl_s FROM exercises WHERE name = 'Seated Leg Curl'                AND is_custom = false;
  SELECT id INTO ex_calf_s     FROM exercises WHERE name = 'Standing Calf Raise'            AND is_custom = false;
  SELECT id INTO ex_plank      FROM exercises WHERE name = 'Plank'                          AND is_custom = false;
  SELECT id INTO ex_knee_raise FROM exercises WHERE name = 'Hanging Knee Raise'             AND is_custom = false;

  SELECT id INTO ex_dips       FROM exercises WHERE name = 'Weighted Dips / Chest Dips'    AND is_custom = false;
  SELECT id INTO ex_incl_bb    FROM exercises WHERE name = 'Incline Barbell Press'          AND is_custom = false;
  SELECT id INTO ex_cable_lh   FROM exercises WHERE name = 'Cable Fly (low-to-high)'        AND is_custom = false;
  SELECT id INTO ex_mach_sh    FROM exercises WHERE name = 'Machine Shoulder Press'         AND is_custom = false;
  SELECT id INTO ex_lat_cable  FROM exercises WHERE name = 'Lateral Raise (Cable)'          AND is_custom = false;
  SELECT id INTO ex_tri_ext    FROM exercises WHERE name = 'Overhead Cable Triceps Ext'     AND is_custom = false;

  SELECT id INTO ex_lat_pull   FROM exercises WHERE name = 'Lat Pulldown (wide grip)'       AND is_custom = false;
  SELECT id INTO ex_cs_row     FROM exercises WHERE name = 'Chest Supported Row'            AND is_custom = false;
  SELECT id INTO ex_sa_pull    FROM exercises WHERE name = 'Straight Arm Lat Pulldown'      AND is_custom = false;
  SELECT id INTO ex_rev_pec    FROM exercises WHERE name = 'Reverse Pec Deck'               AND is_custom = false;
  SELECT id INTO ex_incl_curl  FROM exercises WHERE name = 'Incline Dumbbell Curl'          AND is_custom = false;

  SELECT id INTO ex_leg_press  FROM exercises WHERE name = 'Leg Press'                      AND is_custom = false;
  SELECT id INTO ex_rdl_b      FROM exercises WHERE name = 'Romanian Deadlift' AND day_index = 5;
  SELECT id INTO ex_lunge      FROM exercises WHERE name = 'Walking Lunges'                 AND is_custom = false;
  SELECT id INTO ex_leg_curl_b FROM exercises WHERE name = 'Leg Curl'                       AND is_custom = false;
  SELECT id INTO ex_calf_b     FROM exercises WHERE name = 'Seated Calf Raise'              AND is_custom = false;
  SELECT id INTO ex_cable_crnch FROM exercises WHERE name = 'Cable Crunch'                  AND is_custom = false;
  SELECT id INTO ex_ab_wheel   FROM exercises WHERE name = 'Ab Wheel / Rollout'             AND is_custom = false;

  -- ════════════════════════════════════════════════════════════
  -- WEEK 14  (30 Mar – 5 Apr 2026)
  -- ════════════════════════════════════════════════════════════

  -- ── Push A · 30/03/26 ────────────────────────────────────
  INSERT INTO workout_sessions (user_id, day_index, week_number, year, date)
  VALUES (v_uid, 0, 14, 2026, '2026-03-30')
  ON CONFLICT (user_id, day_index, week_number, year) DO UPDATE SET date = EXCLUDED.date;
  SELECT id INTO sid FROM workout_sessions WHERE user_id=v_uid AND day_index=0 AND week_number=14 AND year=2026;

  INSERT INTO exercise_logs (session_id, exercise_id, set1_weight, set1_reps, set2_weight, set2_reps) VALUES
  (sid, ex_bench,     20,   5,  20,   6),
  (sid, ex_incl_db,   15,  10,  15,  10),
  (sid, ex_cable_fly, 15,  14,  15,  13),
  (sid, ex_db_press,  12.5, 9,  12.5, 9),
  (sid, ex_lat_raise,  7.5,10,   7.5,10),
  (sid, ex_tri_push,  25,  15,  25,  10)
  ON CONFLICT (session_id, exercise_id) DO NOTHING;

  -- ── Pull A · 31/03/26 ────────────────────────────────────
  INSERT INTO workout_sessions (user_id, day_index, week_number, year, date)
  VALUES (v_uid, 1, 14, 2026, '2026-03-31')
  ON CONFLICT (user_id, day_index, week_number, year) DO UPDATE SET date = EXCLUDED.date;
  SELECT id INTO sid FROM workout_sessions WHERE user_id=v_uid AND day_index=1 AND week_number=14 AND year=2026;

  INSERT INTO exercise_logs (session_id, exercise_id, set1_weight, set1_reps, set2_weight, set2_reps, set3_weight, set3_reps) VALUES
  (sid, ex_pullup,   NULL, 7,  NULL, 5, NULL, 6),
  (sid, ex_bb_row,   40,  10,  40,  10, NULL, NULL),
  (sid, ex_cable_row,50,  10,  50,   8, NULL, NULL),
  (sid, ex_face_pull,40,  10,  40,  10, NULL, NULL),
  (sid, ex_bb_curl,  25,   6,  25,   5, NULL, NULL),
  (sid, ex_hammer,   17.5,12,  17.5,12, NULL, NULL)
  ON CONFLICT (session_id, exercise_id) DO NOTHING;

  -- ── Legs A · 01/04/26 ────────────────────────────────────
  INSERT INTO workout_sessions (user_id, day_index, week_number, year, date)
  VALUES (v_uid, 2, 14, 2026, '2026-04-01')
  ON CONFLICT (user_id, day_index, week_number, year) DO UPDATE SET date = EXCLUDED.date;
  SELECT id INTO sid FROM workout_sessions WHERE user_id=v_uid AND day_index=2 AND week_number=14 AND year=2026;

  INSERT INTO exercise_logs (session_id, exercise_id, set1_weight, set1_reps, set2_weight, set2_reps, set3_weight, set3_reps) VALUES
  (sid, ex_squat,    40,  6,  40,  6,  NULL, NULL),
  (sid, ex_rdl_a,    40,  8,  40,  6,  40,   4),
  (sid, ex_leg_ext,  80,  10, 80,  10, NULL, NULL),
  (sid, ex_calf_s,   30,  10, 30,  10, NULL, NULL),
  (sid, ex_plank,    NULL,60, NULL,42, NULL, 48)
  ON CONFLICT (session_id, exercise_id) DO NOTHING;

  -- ── Push B · 02/04/26 ────────────────────────────────────
  INSERT INTO workout_sessions (user_id, day_index, week_number, year, date)
  VALUES (v_uid, 3, 14, 2026, '2026-04-02')
  ON CONFLICT (user_id, day_index, week_number, year) DO UPDATE SET date = EXCLUDED.date;
  SELECT id INTO sid FROM workout_sessions WHERE user_id=v_uid AND day_index=3 AND week_number=14 AND year=2026;

  INSERT INTO exercise_logs (session_id, exercise_id, set1_weight, set1_reps, set2_weight, set2_reps) VALUES
  (sid, ex_dips,     0,   12, 0,   12),
  (sid, ex_incl_bb,  35,   9, 35,   9),
  (sid, ex_cable_lh, 25,  15, 25,  15),
  (sid, ex_mach_sh,  25,  10, 25,  10),
  (sid, ex_lat_cable, 5,  15,  5,  12),
  (sid, ex_tri_ext,  25,  10, 25,  10)
  ON CONFLICT (session_id, exercise_id) DO NOTHING;

  -- ── Pull B · 03/04/26 ────────────────────────────────────
  INSERT INTO workout_sessions (user_id, day_index, week_number, year, date)
  VALUES (v_uid, 4, 14, 2026, '2026-04-03')
  ON CONFLICT (user_id, day_index, week_number, year) DO UPDATE SET date = EXCLUDED.date;
  SELECT id INTO sid FROM workout_sessions WHERE user_id=v_uid AND day_index=4 AND week_number=14 AND year=2026;

  INSERT INTO exercise_logs (session_id, exercise_id, set1_weight, set1_reps, set2_weight, set2_reps) VALUES
  (sid, ex_lat_pull,  45,  10, 45,   8),
  (sid, ex_cs_row,    15,  10, 15,  10),
  (sid, ex_sa_pull,   25,   9, 25,  10),
  (sid, ex_incl_curl,  7.5,10,  7.5,10)
  ON CONFLICT (session_id, exercise_id) DO NOTHING;

  -- ── Legs B · 04/04/26 ────────────────────────────────────
  INSERT INTO workout_sessions (user_id, day_index, week_number, year, date)
  VALUES (v_uid, 5, 14, 2026, '2026-04-04')
  ON CONFLICT (user_id, day_index, week_number, year) DO UPDATE SET date = EXCLUDED.date;
  SELECT id INTO sid FROM workout_sessions WHERE user_id=v_uid AND day_index=5 AND week_number=14 AND year=2026;

  INSERT INTO exercise_logs (session_id, exercise_id, set1_weight, set1_reps, set2_weight, set2_reps, set3_weight, set3_reps) VALUES
  (sid, ex_leg_press,  110, 10, 110, 10, NULL, NULL),
  (sid, ex_leg_curl_b,  40, 12,  40, 11, NULL, NULL),
  (sid, ex_cable_crnch, 50, 12,  50, 10, NULL, NULL),
  (sid, ex_ab_wheel,  NULL,  8, NULL, 10, NULL,  6)
  ON CONFLICT (session_id, exercise_id) DO NOTHING;

  -- ════════════════════════════════════════════════════════════
  -- WEEK 15  (6 Apr – 12 Apr 2026)
  -- ════════════════════════════════════════════════════════════

  -- ── Push A · 07/04/26 ────────────────────────────────────
  INSERT INTO workout_sessions (user_id, day_index, week_number, year, date)
  VALUES (v_uid, 0, 15, 2026, '2026-04-07')
  ON CONFLICT (user_id, day_index, week_number, year) DO UPDATE SET date = EXCLUDED.date;
  SELECT id INTO sid FROM workout_sessions WHERE user_id=v_uid AND day_index=0 AND week_number=15 AND year=2026;

  INSERT INTO exercise_logs (session_id, exercise_id, set1_weight, set1_reps, set2_weight, set2_reps) VALUES
  (sid, ex_bench,     20,   8,  20,   8),
  (sid, ex_incl_db,   17.5, 6,  17.5, 5),
  (sid, ex_cable_fly, 15,  15,  15,  13),
  (sid, ex_db_press,  12.5,10,  12.5, 9),
  (sid, ex_lat_raise,  5,  15,   5,  10),
  (sid, ex_tri_push,  30,  15,  30,  10)
  ON CONFLICT (session_id, exercise_id) DO NOTHING;

  -- ── Pull A · 08/04/26 ────────────────────────────────────
  INSERT INTO workout_sessions (user_id, day_index, week_number, year, date)
  VALUES (v_uid, 1, 15, 2026, '2026-04-08')
  ON CONFLICT (user_id, day_index, week_number, year) DO UPDATE SET date = EXCLUDED.date;
  SELECT id INTO sid FROM workout_sessions WHERE user_id=v_uid AND day_index=1 AND week_number=15 AND year=2026;

  INSERT INTO exercise_logs (session_id, exercise_id, set1_weight, set1_reps, set2_weight, set2_reps, set3_weight, set3_reps) VALUES
  (sid, ex_pullup,    NULL, 5, NULL,  5, NULL, 5),
  (sid, ex_bb_row,    50,  10,  50,  10, NULL, NULL),
  (sid, ex_cable_row, 50,  12,  50,  10, NULL, NULL),
  (sid, ex_face_pull, 35,  12,  35,  12, NULL, NULL),
  (sid, ex_bb_curl,   20,  12,  20,  11, NULL, NULL),
  (sid, ex_hammer,     7.5, 8,   7.5, 6, NULL, NULL)
  ON CONFLICT (session_id, exercise_id) DO NOTHING;

  -- ════════════════════════════════════════════════════════════
  -- WEEK 16  (13 Apr – 19 Apr 2026)
  -- ════════════════════════════════════════════════════════════

  -- ── Push A · 13/04/26 ────────────────────────────────────
  INSERT INTO workout_sessions (user_id, day_index, week_number, year, date)
  VALUES (v_uid, 0, 16, 2026, '2026-04-13')
  ON CONFLICT (user_id, day_index, week_number, year) DO UPDATE SET date = EXCLUDED.date;
  SELECT id INTO sid FROM workout_sessions WHERE user_id=v_uid AND day_index=0 AND week_number=16 AND year=2026;

  INSERT INTO exercise_logs (session_id, exercise_id, set1_weight, set1_reps, set2_weight, set2_reps) VALUES
  (sid, ex_bench,     20,    8,  20,    8),
  (sid, ex_incl_db,   15,    8,  15,    7),
  (sid, ex_cable_fly, 15,   15,  15,   13),
  (sid, ex_db_press,  12.5, 10,  12.5,  8),
  (sid, ex_lat_raise,  5,   15,   5,   15),
  (sid, ex_tri_push,  30,   15,  30,   15)
  ON CONFLICT (session_id, exercise_id) DO NOTHING;

  -- ── Pull A · 14/04/26 ────────────────────────────────────
  INSERT INTO workout_sessions (user_id, day_index, week_number, year, date)
  VALUES (v_uid, 1, 16, 2026, '2026-04-14')
  ON CONFLICT (user_id, day_index, week_number, year) DO UPDATE SET date = EXCLUDED.date;
  SELECT id INTO sid FROM workout_sessions WHERE user_id=v_uid AND day_index=1 AND week_number=16 AND year=2026;

  INSERT INTO exercise_logs (session_id, exercise_id, set1_weight, set1_reps, set2_weight, set2_reps, set3_weight, set3_reps) VALUES
  (sid, ex_pullup,    NULL, 8, NULL,  5, NULL, 3),
  (sid, ex_bb_row,    50,  10,  50,   8, NULL, NULL),
  (sid, ex_cable_row, 50,  12,  50,  11, NULL, NULL),
  (sid, ex_face_pull, 35,  12,  35,  12, NULL, NULL),
  (sid, ex_bb_curl,   20,  12,  20,  12, NULL, NULL),
  (sid, ex_hammer,     7.5, 8,   7.5, 7, NULL, NULL)
  ON CONFLICT (session_id, exercise_id) DO NOTHING;

  -- ── Push B · 16/04/26 ────────────────────────────────────
  INSERT INTO workout_sessions (user_id, day_index, week_number, year, date)
  VALUES (v_uid, 3, 16, 2026, '2026-04-16')
  ON CONFLICT (user_id, day_index, week_number, year) DO UPDATE SET date = EXCLUDED.date;
  SELECT id INTO sid FROM workout_sessions WHERE user_id=v_uid AND day_index=3 AND week_number=16 AND year=2026;

  INSERT INTO exercise_logs (session_id, exercise_id, set1_weight, set1_reps, set2_weight, set2_reps) VALUES
  (sid, ex_dips,      0,   10,  0,   12),
  (sid, ex_incl_bb,   35,  10,  35,   9),
  (sid, ex_cable_lh,  25,  15,  25,  15),
  (sid, ex_mach_sh,   30,   8,  30,   8),
  (sid, ex_lat_cable,  5,  15,   5,  13),
  (sid, ex_tri_ext,   25,  10,  25,  10)
  ON CONFLICT (session_id, exercise_id) DO NOTHING;

  -- ── Pull B · 17/04/26 ────────────────────────────────────
  INSERT INTO workout_sessions (user_id, day_index, week_number, year, date)
  VALUES (v_uid, 4, 16, 2026, '2026-04-17')
  ON CONFLICT (user_id, day_index, week_number, year) DO UPDATE SET date = EXCLUDED.date;
  SELECT id INTO sid FROM workout_sessions WHERE user_id=v_uid AND day_index=4 AND week_number=16 AND year=2026;

  INSERT INTO exercise_logs (session_id, exercise_id, set1_weight, set1_reps, set2_weight, set2_reps) VALUES
  (sid, ex_lat_pull,   45,  10,  45,   8),
  (sid, ex_cs_row,     17.5,10,  17.5, 9),
  (sid, ex_sa_pull,    25,  10,  25,  10),
  (sid, ex_incl_curl,   7.5,10,   7.5,10)
  ON CONFLICT (session_id, exercise_id) DO NOTHING;

  -- ════════════════════════════════════════════════════════════
  -- WEEK 17  (20 Apr – 26 Apr 2026)
  -- ════════════════════════════════════════════════════════════

  -- ── Push A · 20/04/26 ────────────────────────────────────
  INSERT INTO workout_sessions (user_id, day_index, week_number, year, date)
  VALUES (v_uid, 0, 17, 2026, '2026-04-20')
  ON CONFLICT (user_id, day_index, week_number, year) DO UPDATE SET date = EXCLUDED.date;
  SELECT id INTO sid FROM workout_sessions WHERE user_id=v_uid AND day_index=0 AND week_number=17 AND year=2026;

  INSERT INTO exercise_logs (session_id, exercise_id, set1_weight, set1_reps, set2_weight, set2_reps) VALUES
  (sid, ex_bench,     20,    8,  20,    8),
  (sid, ex_incl_db,   15,   10,  15,    9),
  (sid, ex_cable_fly, 15,   15,  15,   15),
  (sid, ex_db_press,  12.5, 10,  12.5, 10),
  (sid, ex_lat_raise,  7.5, 15,   7.5, 15),
  (sid, ex_tri_push,  35,   10,  35,   10)
  ON CONFLICT (session_id, exercise_id) DO NOTHING;

  -- ── Pull A · 21/04/26 ────────────────────────────────────
  INSERT INTO workout_sessions (user_id, day_index, week_number, year, date)
  VALUES (v_uid, 1, 17, 2026, '2026-04-21')
  ON CONFLICT (user_id, day_index, week_number, year) DO UPDATE SET date = EXCLUDED.date;
  SELECT id INTO sid FROM workout_sessions WHERE user_id=v_uid AND day_index=1 AND week_number=17 AND year=2026;

  INSERT INTO exercise_logs (session_id, exercise_id, set1_weight, set1_reps, set2_weight, set2_reps, set3_weight, set3_reps) VALUES
  (sid, ex_pullup,    NULL, 8, NULL,  5, NULL, 3),
  (sid, ex_bb_row,    50,  10,  50,   8, NULL, NULL),
  (sid, ex_cable_row, 50,  12,  50,  11, NULL, NULL),
  (sid, ex_face_pull, 35,  12,  35,  12, NULL, NULL),
  (sid, ex_bb_curl,   20,  12,  20,  12, NULL, NULL),
  (sid, ex_hammer,     7.5, 8,   7.5, 7, NULL, NULL)
  ON CONFLICT (session_id, exercise_id) DO NOTHING;

  -- ── Legs A · 22/04/26 ────────────────────────────────────
  INSERT INTO workout_sessions (user_id, day_index, week_number, year, date)
  VALUES (v_uid, 2, 17, 2026, '2026-04-22')
  ON CONFLICT (user_id, day_index, week_number, year) DO UPDATE SET date = EXCLUDED.date;
  SELECT id INTO sid FROM workout_sessions WHERE user_id=v_uid AND day_index=2 AND week_number=17 AND year=2026;

  INSERT INTO exercise_logs (session_id, exercise_id, set1_weight, set1_reps, set2_weight, set2_reps, set3_weight, set3_reps) VALUES
  (sid, ex_squat,     40,   6,  40,   6, NULL, NULL),
  (sid, ex_rdl_a,     60,   8,  60,   6, NULL, NULL),
  (sid, ex_leg_ext,   80,  15,  80,  15, NULL, NULL),
  (sid, ex_calf_s,    30,  10,  30,  10, NULL, NULL),
  (sid, ex_knee_raise,NULL,10, NULL, 10, NULL, NULL),
  (sid, ex_leg_curl_s,NULL, 9, NULL,  7, NULL,  7),
  (sid, ex_plank,     NULL,60, NULL, 42, NULL, 48)
  ON CONFLICT (session_id, exercise_id) DO NOTHING;

  -- ── Push B · 24/04/26 ────────────────────────────────────
  INSERT INTO workout_sessions (user_id, day_index, week_number, year, date)
  VALUES (v_uid, 3, 17, 2026, '2026-04-24')
  ON CONFLICT (user_id, day_index, week_number, year) DO UPDATE SET date = EXCLUDED.date;
  SELECT id INTO sid FROM workout_sessions WHERE user_id=v_uid AND day_index=3 AND week_number=17 AND year=2026;

  INSERT INTO exercise_logs (session_id, exercise_id, set1_weight, set1_reps, set2_weight, set2_reps) VALUES
  (sid, ex_dips,      0,   12,  0,   12),
  (sid, ex_incl_bb,   35,  10,  35,   9),
  (sid, ex_cable_lh,  25,  15,  25,  15),
  (sid, ex_mach_sh,   30,  10,  30,   9),
  (sid, ex_lat_cable,  5,  15,   5,  13),
  (sid, ex_tri_ext,   25,  10,  25,  10)
  ON CONFLICT (session_id, exercise_id) DO NOTHING;

  RAISE NOTICE 'Historical data seeded successfully for user %', v_uid;
END $$;
