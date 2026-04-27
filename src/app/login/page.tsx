import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/workout')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🏋️</div>
          <h1 className="text-3xl font-bold text-zinc-100">Workout Tracker</h1>
          <p className="mt-2 text-zinc-400">Progressive overload, every week.</p>
        </div>

        <LoginForm />

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-zinc-600 text-sm">or</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <GuestForm />

        <p className="text-center text-zinc-600 text-xs">
          Guest data is stored on this device only and will not sync across devices.
        </p>
      </div>
    </div>
  )
}

function LoginForm() {
  async function signInWithGoogle() {
    'use server'
    const supabase = await createClient()
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })

    if (error) { console.error('OAuth error:', error); return }
    if (data.url) redirect(data.url)
  }

  return (
    <form action={signInWithGoogle}>
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-3 bg-white text-zinc-900 font-semibold py-4 px-6 rounded-2xl text-lg hover:bg-zinc-100 active:bg-zinc-200 transition-colors shadow-lg"
      >
        <GoogleIcon />
        Sign in with Google
      </button>
    </form>
  )
}

function GuestForm() {
  async function continueAsGuest() {
    'use server'
    const cookieStore = await cookies()
    cookieStore.set('guest_mode', '1', {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
      sameSite: 'lax',
      httpOnly: false, // must be readable client-side for sign-out
    })
    redirect('/workout')
  }

  return (
    <form action={continueAsGuest}>
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-3 bg-zinc-800 text-zinc-200 font-semibold py-4 px-6 rounded-2xl text-lg hover:bg-zinc-700 active:bg-zinc-600 transition-colors border border-zinc-700"
      >
        Continue as Guest
      </button>
    </form>
  )
}

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
