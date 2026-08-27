import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Fixed: base must match the repository name for GitHub Pages sub-directory hosting
  base: '/ClawProxy-docs/',
})
