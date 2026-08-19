import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function releaseLane(): string {
  if (process.env.VITE_RELEASE_LANE) return process.env.VITE_RELEASE_LANE
  if (process.env.VERCEL_ENV === 'production') return 'production'
  if (process.env.VERCEL_ENV === 'preview') return 'staging'
  return 'local'
}

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_RELEASE_LANE': JSON.stringify(releaseLane()),
  },
})
