'use client'

import { useState, useMemo } from 'react'
import { GLOBAL_EXERCISE_POOL } from '@/lib/exercises'
import { useWorkoutStore } from '@/lib/store'

interface Props {
  onClose: () => void
}

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Core', 'Full Body']

export default function AddExerciseModal({ onClose }: Props) {
  const [search, setSearch] = useState('')
  const [adding, setAdding] = useState<string | null>(null)

  // Custom exercise fields
  const [customName, setCustomName] = useState('')
  const [customGroup, setCustomGroup] = useState('Chest')
  const [addingCustom, setAddingCustom] = useState(false)

  const currentDayIndex = useWorkoutStore((s) => s.currentDayIndex)
  const exercisesForDay = useWorkoutStore((s) => s.exercises[currentDayIndex])
  const addCustomExercise = useWorkoutStore((s) => s.addCustomExercise)

  const existingNames = useMemo(
    () => new Set((exercisesForDay ?? []).map((e) => e.name.toLowerCase())),
    [exercisesForDay]
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

  async function handleAddCustom() {
    const name = customName.trim()
    if (!name) return
    setAddingCustom(true)
    await addCustomExercise(name, customGroup)
    setAddingCustom(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet — uses dvh so mobile keyboard doesn't crush it */}
      <div className="relative w-full max-w-lg bg-zinc-900 rounded-t-3xl sm:rounded-3xl border border-zinc-700 flex flex-col"
           style={{ maxHeight: 'min(90dvh, 640px)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
          <h2 className="text-lg font-semibold text-zinc-100">Add Exercise</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Custom exercise entry */}
        <div className="px-5 pb-3 flex-shrink-0">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            Create custom
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Exercise name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
              className="flex-1 min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-3 text-zinc-100 text-sm placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <select
              value={customGroup}
              onChange={(e) => setCustomGroup(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-xl px-2 py-3 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              {MUSCLE_GROUPS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <button
              onClick={handleAddCustom}
              disabled={!customName.trim() || addingCustom}
              className="px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold disabled:opacity-40 hover:bg-emerald-500 transition-colors flex-shrink-0 cursor-pointer"
            >
              {addingCustom ? '…' : 'Add'}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 mb-3 h-px bg-zinc-800 flex-shrink-0" />

        {/* Search */}
        <div className="px-5 pb-3 flex-shrink-0">
          <input
            type="text"
            placeholder="Search exercise library..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
          />
        </div>

        {/* Exercise list — scrollable */}
        <div className="overflow-y-auto overscroll-contain flex-1 px-5 pb-8 space-y-4">
          {Object.keys(filteredPool).length === 0 ? (
            <p className="text-zinc-500 text-center py-8 text-sm">No matching exercises in the library</p>
          ) : (
            Object.entries(filteredPool).map(([group, names]) => (
              <div key={group}>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                  {group}
                </p>
                <div className="space-y-1.5">
                  {names.map((name) => (
                    <button
                      key={name}
                      onClick={() => handleAdd(name, group)}
                      disabled={adding === name}
                      className="w-full text-left px-4 py-3.5 rounded-xl bg-zinc-800 active:bg-zinc-600 text-zinc-100 text-sm transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {adding === name ? 'Adding…' : name}
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
