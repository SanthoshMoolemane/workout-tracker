'use client'

import type { Exercise, ExerciseLog } from '@/types'
import { useWorkoutStore } from '@/lib/store'

interface Props {
  exercise: Exercise
  prevLog: ExerciseLog | null
}

export default function ExerciseCard({ exercise, prevLog }: Props) {
  const draft = useWorkoutStore((s) => s.drafts[exercise.id]) ?? {
    set1: { weight: '', reps: '' },
    set2: { weight: '', reps: '' },
    set3: { weight: '', reps: '' },
    showSet3: false,
  }
  const updateSetDraft = useWorkoutStore((s) => s.updateSetDraft)
  const toggleSet3 = useWorkoutStore((s) => s.toggleSet3)

  function prevSetText(w: number | null, r: number | null) {
    if (w === null && r === null) return null
    return `${w ?? '—'}kg × ${r ?? '—'}`
  }

  const prevSets = prevLog
    ? [
        prevSetText(prevLog.set1_weight, prevLog.set1_reps),
        prevSetText(prevLog.set2_weight, prevLog.set2_reps),
        prevLog.set3_weight || prevLog.set3_reps
          ? prevSetText(prevLog.set3_weight, prevLog.set3_reps)
          : null,
      ].filter(Boolean)
    : []

  return (
    <div className="bg-zinc-900 rounded-2xl p-4 space-y-3 border border-zinc-800">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-zinc-100 text-base leading-tight">{exercise.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
              {exercise.muscle_group}
            </span>
            {exercise.rep_target && (
              <span className="text-xs text-zinc-500">{exercise.rep_target} reps</span>
            )}
          </div>
        </div>
      </div>

      {/* Previous week reference */}
      <div className="text-xs text-zinc-500 bg-zinc-800/50 rounded-lg px-3 py-2">
        {prevSets.length > 0 ? (
          <span>Last week: <span className="text-zinc-400">{prevSets.join(' / ')}</span></span>
        ) : (
          <span>No data from last week</span>
        )}
      </div>

      {/* Set inputs */}
      <div className="space-y-2">
        <SetRow
          label="Set 1"
          weight={draft.set1.weight}
          reps={draft.set1.reps}
          onWeightChange={(v) => updateSetDraft(exercise.id, 'set1', 'weight', v)}
          onRepsChange={(v) => updateSetDraft(exercise.id, 'set1', 'reps', v)}
        />
        <SetRow
          label="Set 2"
          weight={draft.set2.weight}
          reps={draft.set2.reps}
          onWeightChange={(v) => updateSetDraft(exercise.id, 'set2', 'weight', v)}
          onRepsChange={(v) => updateSetDraft(exercise.id, 'set2', 'reps', v)}
        />

        {draft.showSet3 && (
          <SetRow
            label="Set 3"
            weight={draft.set3.weight}
            reps={draft.set3.reps}
            onWeightChange={(v) => updateSetDraft(exercise.id, 'set3', 'weight', v)}
            onRepsChange={(v) => updateSetDraft(exercise.id, 'set3', 'reps', v)}
          />
        )}

        <button
          onClick={() => toggleSet3(exercise.id)}
          className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors py-1"
        >
          {draft.showSet3 ? '− Remove Set 3' : '+ Add Set 3'}
        </button>
      </div>
    </div>
  )
}

interface SetRowProps {
  label: string
  weight: string
  reps: string
  onWeightChange: (v: string) => void
  onRepsChange: (v: string) => void
}

function SetRow({ label, weight, reps, onWeightChange, onRepsChange }: SetRowProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-500 w-10 flex-shrink-0">{label}</span>
      <div className="flex items-center gap-1.5 flex-1">
        <input
          type="number"
          inputMode="decimal"
          step="0.5"
          min="0"
          placeholder="0"
          value={weight}
          onChange={(e) => onWeightChange(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-3 text-center text-zinc-100 text-base focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <span className="text-zinc-500 text-sm flex-shrink-0">kg</span>
        <span className="text-zinc-600 text-sm flex-shrink-0">×</span>
        <input
          type="number"
          inputMode="numeric"
          step="1"
          min="0"
          placeholder="0"
          value={reps}
          onChange={(e) => onRepsChange(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-3 text-center text-zinc-100 text-base focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <span className="text-zinc-500 text-sm flex-shrink-0">reps</span>
      </div>
    </div>
  )
}
