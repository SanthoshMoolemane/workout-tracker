import type { WeekInfo } from '@/types'

export function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

export function getCurrentWeekInfo(): WeekInfo {
  const now = new Date()
  const weekNumber = getISOWeekNumber(now)
  const year = now.getFullYear()
  // Edge case: week 1 of year might belong to previous year in ISO numbering
  // getISOWeekNumber already handles this via the UTC year after the date shift
  return { weekNumber, year }
}

export function getPreviousWeekInfo(current: WeekInfo): WeekInfo {
  if (current.weekNumber === 1) {
    const dec28 = new Date(current.year - 1, 11, 28)
    return { weekNumber: getISOWeekNumber(dec28), year: current.year - 1 }
  }
  return { weekNumber: current.weekNumber - 1, year: current.year }
}

export function getDefaultDayIndex(): number {
  // Monday=0 (Push A) through Saturday=5 (Legs B), Sunday defaults to 0
  const day = new Date().getDay() // 0=Sun, 1=Mon, ..., 6=Sat
  const map: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 0: 0 }
  return map[day]
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function emptyDraft(): import('@/types').ExerciseLogDraft {
  return {
    set1: { weight: '', reps: '' },
    set2: { weight: '', reps: '' },
    set3: { weight: '', reps: '' },
    showSet3: false,
  }
}

export function logToDraft(log: import('@/types').ExerciseLog): import('@/types').ExerciseLogDraft {
  return {
    set1: { weight: log.set1_weight?.toString() ?? '', reps: log.set1_reps?.toString() ?? '' },
    set2: { weight: log.set2_weight?.toString() ?? '', reps: log.set2_reps?.toString() ?? '' },
    set3: { weight: log.set3_weight?.toString() ?? '', reps: log.set3_reps?.toString() ?? '' },
    showSet3: log.set3_weight !== null || log.set3_reps !== null,
  }
}

export function draftHasData(draft: import('@/types').ExerciseLogDraft): boolean {
  return !!(draft.set1.weight || draft.set1.reps || draft.set2.weight || draft.set2.reps)
}

// Converts a guest draft (strings) into an ExerciseLog shape for the prev-week display.
export function guestDraftToLog(draft: import('@/types').ExerciseLogDraft, exerciseId: string): import('@/types').ExerciseLog {
  return {
    id: `guest-${exerciseId}`,
    session_id: 'guest',
    exercise_id: exerciseId,
    set1_weight: draft.set1.weight ? parseFloat(draft.set1.weight) : null,
    set1_reps:   draft.set1.reps   ? parseInt(draft.set1.reps)     : null,
    set2_weight: draft.set2.weight ? parseFloat(draft.set2.weight) : null,
    set2_reps:   draft.set2.reps   ? parseInt(draft.set2.reps)     : null,
    set3_weight: draft.showSet3 && draft.set3.weight ? parseFloat(draft.set3.weight) : null,
    set3_reps:   draft.showSet3 && draft.set3.reps   ? parseInt(draft.set3.reps)     : null,
  }
}

// localStorage key for a guest workout session.
export const guestSessionKey = (dayIndex: number, weekNumber: number, year: number) =>
  `wt_session_${dayIndex}_${weekNumber}_${year}`

// localStorage key for guest custom exercises on a day.
export const guestCustomKey = (dayIndex: number) => `wt_custom_${dayIndex}`
