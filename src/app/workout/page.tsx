'use client'

import dynamic from 'next/dynamic'

const WorkoutClient = dynamic(() => import('./WorkoutClient'), { ssr: false })

export default function WorkoutPage() {
  return <WorkoutClient />
}
