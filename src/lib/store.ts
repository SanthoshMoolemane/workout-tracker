'use client'

import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { GUEST_EXERCISES } from '@/lib/exercises'
import type { Exercise, ExerciseLog, ExerciseLogDraft, WorkoutSession } from '@/types'
import {
  getCurrentWeekInfo,
  getPreviousWeekInfo,
  getDefaultDayIndex,
  emptyDraft,
  logToDraft,
  draftHasData,
  guestDraftToLog,
  guestSessionKey,
  guestCustomKey,
} from '@/lib/utils'

// Shape of a guest session stored in localStorage
interface GuestSession {
  date: string
  drafts: Record<string, ExerciseLogDraft>
}

function readGuestSession(dayIndex: number, weekNumber: number, year: number): GuestSession | null {
  try {
    const raw = localStorage.getItem(guestSessionKey(dayIndex, weekNumber, year))
    return raw ? (JSON.parse(raw) as GuestSession) : null
  } catch { return null }
}

function buildGuestExercises(): Record<number, Exercise[]> {
  const byDay: Record<number, Exercise[]> = {}
  for (let d = 0; d <= 5; d++) {
    byDay[d] = [...(GUEST_EXERCISES[d] ?? [])]
    try {
      const custom: Exercise[] = JSON.parse(localStorage.getItem(guestCustomKey(d)) ?? '[]')
      byDay[d] = [...byDay[d], ...custom]
    } catch { /* ignore */ }
  }
  return byDay
}

interface WorkoutStore {
  isGuest: boolean
  exercises: Record<number, Exercise[]>
  exercisesLoaded: boolean
  currentDayIndex: number
  weekNumber: number
  year: number
  drafts: Record<string, ExerciseLogDraft>
  hasUnsavedChanges: boolean
  currentLogs: Record<string, ExerciseLog>
  prevLogs: Record<string, ExerciseLog>
  loading: boolean
  saving: boolean
  error: string | null
  saveSuccess: boolean

  initialize: () => Promise<void>
  setCurrentDay: (dayIndex: number) => void
  updateSetDraft: (exerciseId: string, set: 'set1' | 'set2' | 'set3', field: 'weight' | 'reps', value: string) => void
  updateDraft: (exerciseId: string, field: keyof ExerciseLogDraft, value: string | boolean) => void
  toggleSet3: (exerciseId: string) => void
  saveWorkout: () => Promise<void>
  addCustomExercise: (name: string, muscleGroup: string) => Promise<void>
  clearSaveSuccess: () => void
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  isGuest: false,
  exercises: {},
  exercisesLoaded: false,
  currentDayIndex: 0,
  weekNumber: 0,
  year: 0,
  drafts: {},
  hasUnsavedChanges: false,
  currentLogs: {},
  prevLogs: {},
  loading: false,
  saving: false,
  error: null,
  saveSuccess: false,

  initialize: async () => {
    const defaultDayIndex = getDefaultDayIndex()
    const { weekNumber, year } = getCurrentWeekInfo()
    const prevWeek = getPreviousWeekInfo({ weekNumber, year })
    set({ loading: true, error: null, currentDayIndex: defaultDayIndex, weekNumber, year })

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // ── Guest mode ───────────────────────────────────────────
    if (!user) {
      const byDay = buildGuestExercises()
      const current = readGuestSession(defaultDayIndex, weekNumber, year)
      const prev = readGuestSession(defaultDayIndex, prevWeek.weekNumber, prevWeek.year)

      const dayExercises = byDay[defaultDayIndex] ?? []
      const prevLogs: Record<string, ExerciseLog> = {}
      dayExercises.forEach((ex) => {
        const d = prev?.drafts[ex.id]
        if (d && draftHasData(d)) prevLogs[ex.id] = guestDraftToLog(d, ex.id)
      })

      const drafts: Record<string, ExerciseLogDraft> = {}
      dayExercises.forEach((ex) => {
        const thisWeek = current?.drafts[ex.id]
        drafts[ex.id] = (thisWeek && draftHasData(thisWeek))
          ? thisWeek
          : prev?.drafts[ex.id] && draftHasData(prev.drafts[ex.id])
          ? prev.drafts[ex.id]
          : emptyDraft()
      })

      set({ isGuest: true, exercises: byDay, exercisesLoaded: true, drafts, prevLogs, loading: false })
      return
    }

    // ── Authenticated mode ───────────────────────────────────
    try {
      const { data: exercises, error: exErr } = await supabase
        .from('exercises')
        .select('*')
        .order('created_at', { ascending: true })

      if (exErr) throw exErr

      const byDay: Record<number, Exercise[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] }
      exercises?.forEach((e) => {
        byDay[e.day_index] = [...(byDay[e.day_index] ?? []), e as Exercise]
      })

      const { data: sessions } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('week_number', weekNumber)
        .eq('year', year)

      const currentLogs: Record<string, ExerciseLog> = {}
      if (sessions && sessions.length > 0) {
        const sessionIds = sessions.map((s: WorkoutSession) => s.id)
        const { data: logs } = await supabase
          .from('exercise_logs')
          .select('*')
          .in('session_id', sessionIds)

        const currentSession = sessions.find((s: WorkoutSession) => s.day_index === defaultDayIndex)
        if (currentSession && logs) {
          logs
            .filter((l: ExerciseLog) => l.session_id === currentSession.id)
            .forEach((l: ExerciseLog) => { currentLogs[l.exercise_id] = l })
        }
      }

      const { data: prevSessions } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('week_number', prevWeek.weekNumber)
        .eq('year', prevWeek.year)
        .eq('day_index', defaultDayIndex)

      const prevLogs: Record<string, ExerciseLog> = {}
      if (prevSessions && prevSessions.length > 0) {
        const { data: pLogs } = await supabase
          .from('exercise_logs')
          .select('*')
          .eq('session_id', prevSessions[0].id)
        pLogs?.forEach((l: ExerciseLog) => { prevLogs[l.exercise_id] = l })
      }

      const drafts: Record<string, ExerciseLogDraft> = {}
      const dayExercises = byDay[defaultDayIndex] ?? []
      dayExercises.forEach((ex) => {
        drafts[ex.id] = currentLogs[ex.id]
          ? logToDraft(currentLogs[ex.id])
          : prevLogs[ex.id]
          ? logToDraft(prevLogs[ex.id])
          : emptyDraft()
      })

      set({ isGuest: false, exercises: byDay, exercisesLoaded: true, currentLogs, prevLogs, drafts, loading: false })
    } catch (err) {
      set({ loading: false, error: (err as Error).message })
    }
  },

  setCurrentDay: (dayIndex: number) => {
    if (dayIndex === get().currentDayIndex) return
    const { isGuest, weekNumber, year, exercises } = get()
    const prevWeek = getPreviousWeekInfo({ weekNumber, year })

    if (isGuest) {
      const current = readGuestSession(dayIndex, weekNumber, year)
      const prev = readGuestSession(dayIndex, prevWeek.weekNumber, prevWeek.year)
      const dayExercises = exercises[dayIndex] ?? []
      const prevLogs: Record<string, ExerciseLog> = {}
      dayExercises.forEach((ex) => {
        const d = prev?.drafts[ex.id]
        if (d && draftHasData(d)) prevLogs[ex.id] = guestDraftToLog(d, ex.id)
      })
      const drafts: Record<string, ExerciseLogDraft> = {}
      dayExercises.forEach((ex) => {
        const thisWeek = current?.drafts[ex.id]
        drafts[ex.id] = (thisWeek && draftHasData(thisWeek))
          ? thisWeek
          : prev?.drafts[ex.id] && draftHasData(prev.drafts[ex.id])
          ? prev.drafts[ex.id]
          : emptyDraft()
      })
      set({ currentDayIndex: dayIndex, drafts, prevLogs, hasUnsavedChanges: false })
      return
    }

    // Authenticated: async load from Supabase
    set({ currentDayIndex: dayIndex, loading: true, error: null })
    const supabase = createClient()
    ;(async () => {
      try {
        const { data: session } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('week_number', weekNumber)
          .eq('year', year)
          .eq('day_index', dayIndex)
          .maybeSingle()

        const currentLogs: Record<string, ExerciseLog> = {}
        if (session) {
          const { data: logs } = await supabase.from('exercise_logs').select('*').eq('session_id', session.id)
          logs?.forEach((l: ExerciseLog) => { currentLogs[l.exercise_id] = l })
        }

        const { data: prevSession } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('week_number', prevWeek.weekNumber)
          .eq('year', prevWeek.year)
          .eq('day_index', dayIndex)
          .maybeSingle()

        const prevLogs: Record<string, ExerciseLog> = {}
        if (prevSession) {
          const { data: pLogs } = await supabase.from('exercise_logs').select('*').eq('session_id', prevSession.id)
          pLogs?.forEach((l: ExerciseLog) => { prevLogs[l.exercise_id] = l })
        }

        const dayExercises = exercises[dayIndex] ?? []
        const drafts: Record<string, ExerciseLogDraft> = {}
        dayExercises.forEach((ex) => {
          drafts[ex.id] = currentLogs[ex.id]
            ? logToDraft(currentLogs[ex.id])
            : prevLogs[ex.id]
            ? logToDraft(prevLogs[ex.id])
            : emptyDraft()
        })

        set({ currentLogs, prevLogs, drafts, hasUnsavedChanges: false, loading: false })
      } catch (err) {
        set({ loading: false, error: (err as Error).message })
      }
    })()
  },

  updateSetDraft: (exerciseId, set_key, field, value) => {
    const drafts = { ...get().drafts }
    const draft = drafts[exerciseId] ?? emptyDraft()
    drafts[exerciseId] = { ...draft, [set_key]: { ...draft[set_key], [field]: value } }
    set({ drafts, hasUnsavedChanges: true })
  },

  updateDraft: (exerciseId, field, value) => {
    const drafts = { ...get().drafts }
    const draft = drafts[exerciseId] ?? emptyDraft()
    drafts[exerciseId] = { ...draft, [field]: value }
    set({ drafts, hasUnsavedChanges: true })
  },

  toggleSet3: (exerciseId) => {
    const drafts = { ...get().drafts }
    const draft = drafts[exerciseId] ?? emptyDraft()
    drafts[exerciseId] = { ...draft, showSet3: !draft.showSet3 }
    set({ drafts, hasUnsavedChanges: true })
  },

  saveWorkout: async () => {
    const { isGuest, currentDayIndex, weekNumber, year, drafts, exercises } = get()
    set({ saving: true, error: null, saveSuccess: false })

    // ── Guest save → localStorage ────────────────────────────
    if (isGuest) {
      const session: GuestSession = {
        date: new Date().toISOString().split('T')[0],
        drafts,
      }
      localStorage.setItem(guestSessionKey(currentDayIndex, weekNumber, year), JSON.stringify(session))
      set({ saving: false, hasUnsavedChanges: false, saveSuccess: true })
      return
    }

    // ── Authenticated save → Supabase ────────────────────────
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { set({ saving: false, error: 'Not logged in' }); return }

    try {
      const today = new Date().toISOString().split('T')[0]
      const { data: session, error: sessionErr } = await supabase
        .from('workout_sessions')
        .upsert(
          { user_id: user.id, day_index: currentDayIndex, week_number: weekNumber, year, date: today },
          { onConflict: 'user_id,day_index,week_number,year' }
        )
        .select()
        .single()

      if (sessionErr) throw sessionErr

      const dayExercises = exercises[currentDayIndex] ?? []
      const logsToUpsert = dayExercises
        .filter((ex) => draftHasData(drafts[ex.id] ?? emptyDraft()))
        .map((ex) => {
          const d = drafts[ex.id]
          return {
            session_id: session.id,
            exercise_id: ex.id,
            set1_weight: d.set1.weight ? parseFloat(d.set1.weight) : null,
            set1_reps:   d.set1.reps   ? parseInt(d.set1.reps)     : null,
            set2_weight: d.set2.weight ? parseFloat(d.set2.weight) : null,
            set2_reps:   d.set2.reps   ? parseInt(d.set2.reps)     : null,
            set3_weight: d.showSet3 && d.set3.weight ? parseFloat(d.set3.weight) : null,
            set3_reps:   d.showSet3 && d.set3.reps   ? parseInt(d.set3.reps)     : null,
          }
        })

      if (logsToUpsert.length > 0) {
        const { error: logsErr } = await supabase
          .from('exercise_logs')
          .upsert(logsToUpsert, { onConflict: 'session_id,exercise_id' })
        if (logsErr) throw logsErr
      }

      set({ saving: false, hasUnsavedChanges: false, saveSuccess: true })
    } catch (err) {
      set({ saving: false, error: (err as Error).message })
    }
  },

  addCustomExercise: async (name: string, muscleGroup: string) => {
    const { isGuest, currentDayIndex, exercises } = get()

    // ── Guest: persist to localStorage ──────────────────────
    if (isGuest) {
      const newExercise: Exercise = {
        id: `gc-${currentDayIndex}-${Date.now()}`,
        name,
        muscle_group: muscleGroup,
        rep_target: '8–12',
        is_custom: true,
        user_id: null,
        day_index: currentDayIndex,
      }
      const existing: Exercise[] = JSON.parse(localStorage.getItem(guestCustomKey(currentDayIndex)) ?? '[]')
      localStorage.setItem(guestCustomKey(currentDayIndex), JSON.stringify([...existing, newExercise]))
      const updatedDay = [...(exercises[currentDayIndex] ?? []), newExercise]
      set({
        exercises: { ...exercises, [currentDayIndex]: updatedDay },
        drafts: { ...get().drafts, [newExercise.id]: emptyDraft() },
      })
      return
    }

    // ── Authenticated: persist to Supabase ───────────────────
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('exercises')
      .insert({ name, muscle_group: muscleGroup, rep_target: '8–12', is_custom: true, user_id: user.id, day_index: currentDayIndex })
      .select()
      .single()

    if (error || !data) return

    const newExercise = data as Exercise
    const updatedDay = [...(exercises[currentDayIndex] ?? []), newExercise]
    set({
      exercises: { ...exercises, [currentDayIndex]: updatedDay },
      drafts: { ...get().drafts, [newExercise.id]: emptyDraft() },
    })
  },

  clearSaveSuccess: () => set({ saveSuccess: false }),
}))
