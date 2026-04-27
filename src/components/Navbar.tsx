'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useWorkoutStore } from '@/lib/store'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const isGuest = useWorkoutStore((s) => s.isGuest)

  async function signOut() {
    if (isGuest) {
      // Clear the guest_mode cookie (not httpOnly, so client can remove it)
      document.cookie = 'guest_mode=; Max-Age=0; path=/'
      router.push('/login')
      return
    }
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur border-b border-zinc-800">
      <div className="max-w-2xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-zinc-100">🏋️ PPL Tracker</span>
          {isGuest && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium">
              Guest
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="/workout"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/workout'
                ? 'bg-emerald-600 text-white'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
            }`}
          >
            Workout
          </Link>
          <Link
            href="/progress"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/progress'
                ? 'bg-emerald-600 text-white'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
            }`}
          >
            Progress
          </Link>
          <button
            onClick={signOut}
            className="ml-2 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            {isGuest ? 'Sign in' : 'Sign out'}
          </button>
        </div>
      </div>
    </nav>
  )
}
