'use client'

import { WORKOUT_DAYS } from '@/lib/exercises'
import { useWorkoutStore } from '@/lib/store'

export default function DayTabs() {
  const currentDayIndex = useWorkoutStore((s) => s.currentDayIndex)
  const hasUnsavedChanges = useWorkoutStore((s) => s.hasUnsavedChanges)
  const setCurrentDay = useWorkoutStore((s) => s.setCurrentDay)

  function handleDayChange(index: number) {
    if (index === currentDayIndex) return
    if (hasUnsavedChanges) {
      const ok = window.confirm('You have unsaved changes. Switch day without saving?')
      if (!ok) return
    }
    setCurrentDay(index)
  }

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 px-4 py-3 no-scrollbar">
      {WORKOUT_DAYS.map((day) => (
        <button
          key={day.index}
          onClick={() => handleDayChange(day.index)}
          className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            currentDayIndex === day.index
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100'
          }`}
        >
          <div className="text-xs opacity-75">Day {day.index + 1}</div>
          <div>{day.name}</div>
        </button>
      ))}
    </div>
  )
}
