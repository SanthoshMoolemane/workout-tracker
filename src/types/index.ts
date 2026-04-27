export interface Exercise {
  id: string
  name: string
  muscle_group: string
  rep_target: string | null
  is_custom: boolean
  user_id: string | null
  day_index: number
}

export interface WorkoutSession {
  id: string
  user_id: string
  day_index: number
  week_number: number
  year: number
  date: string
}

export interface ExerciseLog {
  id: string
  session_id: string
  exercise_id: string
  set1_weight: number | null
  set1_reps: number | null
  set2_weight: number | null
  set2_reps: number | null
  set3_weight: number | null
  set3_reps: number | null
}

export interface SetDraft {
  weight: string
  reps: string
}

export interface ExerciseLogDraft {
  set1: SetDraft
  set2: SetDraft
  set3: SetDraft
  showSet3: boolean
}

export interface WeekInfo {
  weekNumber: number
  year: number
}
