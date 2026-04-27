import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allows the app to read the site URL from env for OAuth redirects
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  },
}

export default nextConfig
