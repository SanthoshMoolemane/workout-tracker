'use client'

import { useState, useMemo } from 'react'
import { GLOBAL_EXERCISE_POOL } from '@/lib/exercises'
import { useWorkoutStore } from '@/lib/store'

interface Props {
  onClose: () => void
}

export default function AddExerciseModal({ onClose }: Props) {
  const [search, setSearch] = useState('')
  const [adding, setAdding] = useState<string | null>(null)

  const currentDayIndex = useWorkoutStore((s) => s.currentDayIndex)
  const exercises = useWorkoutStore((s) => s.exercises[currentDayIndex] ?? [])
  const addCustomExercise = useWorkoutStore((s) => s.addCustomExercise)

  const existingNames = useMemo(
    () => new Set(exercises.map((e) => e.name.toLowerCase())),
    [exercises]
  )

  const filteredPool = useMemo(() => {
    const q = search.toLowerCase()
    const result: Record<string, string[]> = {}
    Object.entries(GLOBAL_EXERCISE_POOL).forEach(([group, names]) => {
      const filtered = names.filter(
        (n) => !existingNames.has(n.toLowerCase()) && (!q || n.toLowerCase().includes(q))
      )
      if (filtered.length > 0) result[group] = filtered
    })
    return result
  }, [search, existingNames])

  async function handleAdd(name: string, group: string) {
    setAdding(name)
    await addCustomExercise(name, group)
    setAdding(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full max-w-lg bg-zinc-900 rounded-t-3xl sm:rounded-3xl border border-zinc-700 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-lg font-semibold text-zinc-100">Add Exercise</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-5 pb-3">
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-6 space-y-4">
          {Object.keys(filteredPool).length === 0 ? (
            <p className="text-zinc-500 text-center py-8">No exercises found</p>
          ) : (
            Object.entries(filteredPool).map(([group, names]) => (
              <div key={group}>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                  {group}
                </p>
                <div className="space-y-1">
                  {names.map((name) => (
                    <button
                      key={name}
                      onClick={() => handleAdd(name, group)}
                      disabled={adding === name}
                      className="w-full text-left px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm transition-colors disabled:opacity-50"
                    >
                      {adding === name ? 'Adding...' : name}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
