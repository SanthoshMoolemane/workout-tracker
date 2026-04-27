'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { WORKOUT_DAYS, getGuestExerciseById } from '@/lib/exercises'
import { useWorkoutStore } from '@/lib/store'
import Navbar from '@/components/Navbar'
import type { Exercise, ExerciseLog, ExerciseLogDraft, WorkoutSession } from '@/types'

interface ProgressRow {
  date: string
  day_index: number
  set1_weight: number | null
  set1_reps: number | null
  set2_weight: number | null
  set2_reps: number | null
  set3_weight: number | null
  set3_reps: number | null
}

function setLabel(w: number | null, r: number | null) {
  if (w === null && r === null) return '—'
  return `${w ?? '—'}kg × ${r ?? '—'}`
}

export default function ProgressClient() {
  const isGuest = useWorkoutStore((s) => s.isGuest)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [rows, setRows] = useState<ProgressRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingRows, setLoadingRows] = useState(false)

  useEffect(() => {
    if (isGuest) {
      // Scan localStorage — wrap setState calls in a microtask to satisfy the effect rule
      Promise.resolve().then(() => {
        const seen = new Map<string, Exercise>()
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (!key?.startsWith('wt_session_')) continue
          try {
            const { drafts } = JSON.parse(localStorage.getItem(key) ?? '{}') as { drafts: Record<string, ExerciseLogDraft> }
            Object.entries(drafts ?? {}).forEach(([exerciseId, draft]) => {
              if (!seen.has(exerciseId) && (draft.set1.weight || draft.set1.reps)) {
                const ex = getGuestExerciseById(exerciseId)
                if (ex) seen.set(exerciseId, ex)
              }
            })
          } catch { /* skip corrupt entry */ }
        }
        const exs = [...seen.values()].sort((a, b) => a.name.localeCompare(b.name))
        setExercises(exs)
        if (exs.length > 0) setSelectedId(exs[0].id)
        setLoading(false)
      })
    } else {
      // Query Supabase for exercises the user has logged
      const supabase = createClient()
      supabase
        .from('exercise_logs')
        .select('exercise_id, exercises(id, name, muscle_group, day_index)')
        .then(({ data: logs }) => {
          if (!logs) { setLoading(false); return }
          const seen = new Set<string>()
          const exs: Exercise[] = []
          logs.forEach((l: { exercise_id: string; exercises: unknown }) => {
            if (!seen.has(l.exercise_id) && l.exercises) {
              seen.add(l.exercise_id)
              exs.push(l.exercises as Exercise)
            }
          })
          exs.sort((a, b) => a.name.localeCompare(b.name))
          setExercises(exs)
          if (exs.length > 0) setSelectedId(exs[0].id)
          setLoading(false)
        })
    }
  }, [isGuest])

  useEffect(() => {
    if (!selectedId) return

    if (isGuest) {
      Promise.resolve().then(() => {
      setLoadingRows(true)
      const result: ProgressRow[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (!key?.startsWith('wt_session_')) continue
        try {
          const parts = key.split('_')           // wt_session_{day}_{week}_{year}
          const dayIdx = parseInt(parts[2])
          const stored = JSON.parse(localStorage.getItem(key) ?? '{}') as { date: string; drafts: Record<string, ExerciseLogDraft> }
          const draft = stored.drafts?.[selectedId]
          if (!draft || (!draft.set1.weight && !draft.set1.reps)) continue
          result.push({
            date: stored.date ?? '',
            day_index: dayIdx,
            set1_weight: draft.set1.weight ? parseFloat(draft.set1.weight) : null,
            set1_reps:   draft.set1.reps   ? parseInt(draft.set1.reps)     : null,
            set2_weight: draft.set2.weight ? parseFloat(draft.set2.weight) : null,
            set2_reps:   draft.set2.reps   ? parseInt(draft.set2.reps)     : null,
            set3_weight: draft.showSet3 && draft.set3.weight ? parseFloat(draft.set3.weight) : null,
            set3_reps:   draft.showSet3 && draft.set3.reps   ? parseInt(draft.set3.reps)     : null,
          })
        } catch { /* skip */ }
      }
      result.sort((a, b) => b.date.localeCompare(a.date))
      setRows(result)
      setLoadingRows(false)
      }) // end Promise.resolve().then
    } else {
      const supabase = createClient()
      supabase
        .from('exercise_logs')
        .select('*, workout_sessions(date, day_index)')
        .eq('exercise_id', selectedId)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setLoadingRows(true)
          if (data) {
            setRows(data.map((l: ExerciseLog & { workout_sessions: WorkoutSession }) => ({
              date: l.workout_sessions?.date ?? '',
              day_index: l.workout_sessions?.day_index ?? 0,
              set1_weight: l.set1_weight,
              set1_reps: l.set1_reps,
              set2_weight: l.set2_weight,
              set2_reps: l.set2_reps,
              set3_weight: l.set3_weight,
              set3_reps: l.set3_reps,
            })))
          }
          setLoadingRows(false)
        })
    }
  }, [selectedId, isGuest])

  const selectedExercise = exercises.find((e) => e.id === selectedId)

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-zinc-100 mb-6">Progress</h1>

        {loading ? (
          <p className="text-zinc-500 animate-pulse">Loading history...</p>
        ) : exercises.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-zinc-500 text-lg">No workouts logged yet.</p>
            <p className="text-zinc-600 text-sm mt-2">Go to the Workout tab and save a session first.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm text-zinc-400 mb-2">Select Exercise</label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} — {ex.muscle_group}
                  </option>
                ))}
              </select>
            </div>

            {selectedExercise && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-zinc-100">{selectedExercise.name}</h2>
                <p className="text-zinc-500 text-sm">
                  {selectedExercise.muscle_group} · {WORKOUT_DAYS[selectedExercise.day_index]?.name}
                </p>
              </div>
            )}

            {loadingRows ? (
              <p className="text-zinc-500 animate-pulse text-sm">Loading...</p>
            ) : rows.length === 0 ? (
              <p className="text-zinc-500 text-sm">No history found for this exercise.</p>
            ) : (
              <div className="overflow-x-auto -mx-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-zinc-500 text-xs uppercase tracking-wider">
                      <th className="text-left px-4 py-2 font-medium">Date</th>
                      <th className="text-center px-3 py-2 font-medium">Set 1</th>
                      <th className="text-center px-3 py-2 font-medium">Set 2</th>
                      <th className="text-center px-3 py-2 font-medium">Set 3</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {rows.map((row, i) => (
                      <tr key={i} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">
                          {row.date ? formatDate(row.date) : '—'}
                        </td>
                        <td className="px-3 py-3 text-center text-zinc-400">
                          {setLabel(row.set1_weight, row.set1_reps)}
                        </td>
                        <td className="px-3 py-3 text-center text-zinc-400">
                          {setLabel(row.set2_weight, row.set2_reps)}
                        </td>
                        <td className="px-3 py-3 text-center text-zinc-500">
                          {row.set3_weight || row.set3_reps ? setLabel(row.set3_weight, row.set3_reps) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </>
  )
}
