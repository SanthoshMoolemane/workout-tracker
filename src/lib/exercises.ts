import type { Exercise } from '@/types'

export const WORKOUT_DAYS = [
  { index: 0, name: 'Push A', description: 'Chest · Shoulders · Triceps' },
  { index: 1, name: 'Pull A', description: 'Back · Biceps · Forearms' },
  { index: 2, name: 'Legs A', description: 'Legs + Core' },
  { index: 3, name: 'Push B', description: 'Chest · Shoulders · Triceps' },
  { index: 4, name: 'Pull B', description: 'Back · Biceps · Forearms' },
  { index: 5, name: 'Legs B', description: 'Legs + Core' },
]

// Stable hardcoded exercises for guest mode (no Supabase needed).
// IDs use format "pe-{dayIndex}-{exerciseIndex}" and never change.
export const GUEST_EXERCISES: Record<number, Exercise[]> = {
  0: [
    { id: 'pe-0-0', name: 'Barbell Bench Press',           muscle_group: 'Chest',            rep_target: '5–8',          is_custom: false, user_id: null, day_index: 0 },
    { id: 'pe-0-1', name: 'Incline Dumbbell Press',        muscle_group: 'Chest',            rep_target: '6–10',         is_custom: false, user_id: null, day_index: 0 },
    { id: 'pe-0-2', name: 'Cable Chest Fly',               muscle_group: 'Chest',            rep_target: '10–15',        is_custom: false, user_id: null, day_index: 0 },
    { id: 'pe-0-3', name: 'Seated Dumbbell Shoulder Press',muscle_group: 'Shoulders',        rep_target: '6–10',         is_custom: false, user_id: null, day_index: 0 },
    { id: 'pe-0-4', name: 'Dumbbell Lateral Raise',        muscle_group: 'Shoulders',        rep_target: '12–15',        is_custom: false, user_id: null, day_index: 0 },
    { id: 'pe-0-5', name: 'Cable Triceps Pushdown',        muscle_group: 'Triceps',          rep_target: '10–15',        is_custom: false, user_id: null, day_index: 0 },
  ],
  1: [
    { id: 'pe-1-0', name: 'Pull-Ups / Lat Pulldown',       muscle_group: 'Back',             rep_target: '6–10',         is_custom: false, user_id: null, day_index: 1 },
    { id: 'pe-1-1', name: 'Barbell Row',                   muscle_group: 'Back',             rep_target: '6–10',         is_custom: false, user_id: null, day_index: 1 },
    { id: 'pe-1-2', name: 'Seated Cable Row',              muscle_group: 'Back',             rep_target: '8–12',         is_custom: false, user_id: null, day_index: 1 },
    { id: 'pe-1-3', name: 'Face Pull',                     muscle_group: 'Rear Delts',       rep_target: '12–15',        is_custom: false, user_id: null, day_index: 1 },
    { id: 'pe-1-4', name: 'Barbell Curl',                  muscle_group: 'Biceps',           rep_target: '8–12',         is_custom: false, user_id: null, day_index: 1 },
    { id: 'pe-1-5', name: 'Hammer Curl',                   muscle_group: 'Biceps / Forearms',rep_target: '10–12',        is_custom: false, user_id: null, day_index: 1 },
  ],
  2: [
    { id: 'pe-2-0', name: 'Back Squat',                    muscle_group: 'Quads',            rep_target: '5–8',          is_custom: false, user_id: null, day_index: 2 },
    { id: 'pe-2-1', name: 'Romanian Deadlift',             muscle_group: 'Hamstrings',       rep_target: '6–10',         is_custom: false, user_id: null, day_index: 2 },
    { id: 'pe-2-2', name: 'Leg Extension',                 muscle_group: 'Quads',            rep_target: '10–15',        is_custom: false, user_id: null, day_index: 2 },
    { id: 'pe-2-3', name: 'Seated Leg Curl',               muscle_group: 'Hamstrings',       rep_target: '10–15',        is_custom: false, user_id: null, day_index: 2 },
    { id: 'pe-2-4', name: 'Standing Calf Raise',           muscle_group: 'Calves',           rep_target: '12–20',        is_custom: false, user_id: null, day_index: 2 },
    { id: 'pe-2-5', name: 'Plank',                         muscle_group: 'Core',             rep_target: '30–60 sec',    is_custom: false, user_id: null, day_index: 2 },
    { id: 'pe-2-6', name: 'Hanging Knee Raise',            muscle_group: 'Core',             rep_target: '12–15',        is_custom: false, user_id: null, day_index: 2 },
  ],
  3: [
    { id: 'pe-3-0', name: 'Weighted Dips / Chest Dips',   muscle_group: 'Chest',            rep_target: '6–10',         is_custom: false, user_id: null, day_index: 3 },
    { id: 'pe-3-1', name: 'Incline Barbell Press',         muscle_group: 'Chest',            rep_target: '6–10',         is_custom: false, user_id: null, day_index: 3 },
    { id: 'pe-3-2', name: 'Cable Fly (low-to-high)',       muscle_group: 'Chest',            rep_target: '10–15',        is_custom: false, user_id: null, day_index: 3 },
    { id: 'pe-3-3', name: 'Machine Shoulder Press',        muscle_group: 'Shoulders',        rep_target: '6–10',         is_custom: false, user_id: null, day_index: 3 },
    { id: 'pe-3-4', name: 'Lateral Raise (Cable)',         muscle_group: 'Shoulders',        rep_target: '12–15',        is_custom: false, user_id: null, day_index: 3 },
    { id: 'pe-3-5', name: 'Overhead Cable Triceps Ext',   muscle_group: 'Triceps',          rep_target: '10–15',        is_custom: false, user_id: null, day_index: 3 },
  ],
  4: [
    { id: 'pe-4-0', name: 'Lat Pulldown (wide grip)',      muscle_group: 'Back',             rep_target: '6–10',         is_custom: false, user_id: null, day_index: 4 },
    { id: 'pe-4-1', name: 'Chest Supported Row',           muscle_group: 'Back',             rep_target: '6–10',         is_custom: false, user_id: null, day_index: 4 },
    { id: 'pe-4-2', name: 'Straight Arm Lat Pulldown',     muscle_group: 'Back',             rep_target: '10–12',        is_custom: false, user_id: null, day_index: 4 },
    { id: 'pe-4-3', name: 'Reverse Pec Deck',              muscle_group: 'Rear Delts',       rep_target: '12–15',        is_custom: false, user_id: null, day_index: 4 },
    { id: 'pe-4-4', name: 'Incline Dumbbell Curl',         muscle_group: 'Biceps',           rep_target: '8–12',         is_custom: false, user_id: null, day_index: 4 },
    { id: 'pe-4-5', name: 'Wrist Curl (Forearms)',         muscle_group: 'Forearms',         rep_target: '12–15',        is_custom: false, user_id: null, day_index: 4 },
  ],
  5: [
    { id: 'pe-5-0', name: 'Leg Press',                     muscle_group: 'Quads',            rep_target: '6–10',         is_custom: false, user_id: null, day_index: 5 },
    { id: 'pe-5-1', name: 'Romanian Deadlift',             muscle_group: 'Hamstrings',       rep_target: '6–10',         is_custom: false, user_id: null, day_index: 5 },
    { id: 'pe-5-2', name: 'Walking Lunges',                muscle_group: 'Quads / Glutes',   rep_target: '10–12 each leg',is_custom: false, user_id: null, day_index: 5 },
    { id: 'pe-5-3', name: 'Leg Curl',                      muscle_group: 'Hamstrings',       rep_target: '10–15',        is_custom: false, user_id: null, day_index: 5 },
    { id: 'pe-5-4', name: 'Seated Calf Raise',             muscle_group: 'Calves',           rep_target: '12–20',        is_custom: false, user_id: null, day_index: 5 },
    { id: 'pe-5-5', name: 'Cable Crunch',                  muscle_group: 'Core',             rep_target: '12–15',        is_custom: false, user_id: null, day_index: 5 },
    { id: 'pe-5-6', name: 'Ab Wheel / Rollout',            muscle_group: 'Core',             rep_target: '8–12',         is_custom: false, user_id: null, day_index: 5 },
  ],
}

// Looks up an exercise by ID across all predefined days + guest localStorage custom exercises.
export function getGuestExerciseById(id: string): Exercise | null {
  for (const dayExercises of Object.values(GUEST_EXERCISES)) {
    const found = dayExercises.find((ex) => ex.id === id)
    if (found) return found
  }
  for (let d = 0; d <= 5; d++) {
    try {
      const custom: Exercise[] = JSON.parse(localStorage.getItem(`wt_custom_${d}`) ?? '[]')
      const found = custom.find((ex) => ex.id === id)
      if (found) return found
    } catch { /* ignore */ }
  }
  return null
}

// Pool of exercises available in the "Add Exercise" modal, grouped by muscle group.
export const GLOBAL_EXERCISE_POOL: Record<string, string[]> = {
  Chest: ['Dumbbell Bench Press', 'Push-Ups', 'Pec Deck', 'Cable Crossover', 'Dips'],
  Back: ['T-Bar Row', 'Meadows Row', 'Rack Pull', 'Shrugs', 'Deadlift'],
  Shoulders: ['Arnold Press', 'Upright Row', 'Front Raise', 'Overhead Press (Barbell)'],
  Biceps: ['Concentration Curl', 'Spider Curl', 'Cable Curl', 'Preacher Curl'],
  Triceps: ['Tricep Dips', 'Diamond Push-Up', 'Cable Kickback', 'JM Press', 'Skullcrushers'],
  Legs: ['Sissy Squat', 'Good Morning', 'Step-Ups', 'Box Jump', 'Glute Kickback', 'Bulgarian Split Squat', 'Nordic Curl', 'Hack Squat'],
  Core: ['Plank', 'Hanging Leg Raise', 'Ab Wheel Rollout', 'Russian Twist', 'Cable Crunch', 'Leg Raises'],
  'Full Body': ['Power Clean', 'Snatch', 'Thruster', 'Kettlebell Swing', 'Turkish Get-Up'],
}
