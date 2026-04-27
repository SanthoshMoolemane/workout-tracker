'use client'

import { useEffect, useState } from 'react'
import { useWorkoutStore } from '@/lib/store'
import { WORKOUT_DAYS } from '@/lib/exercises'
import Navbar from '@/components/Navbar'
import DayTabs from '@/components/DayTabs'
import ExerciseCard from '@/components/ExerciseCard'
import AddExerciseModal from '@/components/AddExerciseModal'

export default function WorkoutClient() {
  const initialize = useWorkoutStore((s) => s.initialize)
  const exercisesLoaded = useWorkoutStore((s) => s.exercisesLoaded)
  const loading = useWorkoutStore((s) => s.loading)
  const saving = useWorkoutStore((s) => s.saving)
  const saveSuccess = useWorkoutStore((s) => s.saveSuccess)
  const error = useWorkoutStore((s) => s.error)
  const hasUnsavedChanges = useWorkoutStore((s) => s.hasUnsavedChanges)
  const currentDayIndex = useWorkoutStore((s) => s.currentDayIndex)
  // Move ?? [] outside the selector so the selector returns a stable reference (undefined or the existing array)
  const exercises = useWorkoutStore((s) => s.exercises[currentDayIndex]) ?? []
  const prevLogs = useWorkoutStore((s) => s.prevLogs)
  const weekNumber = useWorkoutStore((s) => s.weekNumber)
  const saveWorkout = useWorkoutStore((s) => s.saveWorkout)
  const clearSaveSuccess = useWorkoutStore((s) => s.clearSaveSuccess)

  const [showModal, setShowModal] = useState(false)
  // Safe to call new Date() here — no SSR on this component
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [hasUnsavedChanges])

  useEffect(() => {
    if (saveSuccess) {
      const t = setTimeout(clearSaveSuccess, 3000)
      return () => clearTimeout(t)
    }
  }, [saveSuccess, clearSaveSuccess])

  const day = WORKOUT_DAYS[currentDayIndex]

  if (!exercisesLoaded && loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-zinc-500 animate-pulse text-lg">Loading your workouts...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />

      {saveSuccess && (
        <div className="fixed top-16 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
          <div className="bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg">
            Workout saved!
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto pb-32">
        <DayTabs />

        <div className="px-4 pt-2 pb-3">
          <h1 className="text-2xl font-bold text-zinc-100">
            Day {currentDayIndex + 1} — {day.name}
          </h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            {day.description} · Week {weekNumber || '—'} · {today}
          </p>
        </div>

        {error && (
          <div className="mx-4 mb-3 bg-red-900/40 border border-red-700 text-red-300 rounded-xl px-4 py-3 text-sm">
            {error} — <button onClick={saveWorkout} className="underline">retry</button>
          </div>
        )}

        {loading && exercisesLoaded && (
          <div className="mx-4 mb-3 text-zinc-500 text-sm animate-pulse">Loading day data...</div>
        )}

        <div className="px-4 space-y-3">
          {exercises.map((ex) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              prevLog={prevLogs[ex.id] ?? null}
            />
          ))}

          {exercises.length === 0 && !loading && (
            <p className="text-zinc-600 text-center py-8">No exercises for this day yet.</p>
          )}
        </div>

        <div className="px-4 mt-4">
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-3.5 rounded-2xl border-2 border-dashed border-zinc-700 text-zinc-500 hover:border-emerald-600 hover:text-emerald-500 transition-colors text-sm font-medium"
          >
            + Add Exercise
          </button>
        </div>
      </main>

      <div className="fixed bottom-0 inset-x-0 bg-zinc-950/95 backdrop-blur border-t border-zinc-800 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={saveWorkout}
            disabled={saving || !hasUnsavedChanges}
            className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-semibold text-base transition-all hover:bg-emerald-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/30"
          >
            {saving ? 'Saving...' : hasUnsavedChanges ? 'Save Workout' : 'All Saved'}
          </button>
        </div>
      </div>

      {showModal && <AddExerciseModal onClose={() => setShowModal(false)} />}
    </>
  )
}
