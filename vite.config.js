import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // If deploying to https://<username>.github.io/<repo-name>/
  // Change base to '/<repo-name>/'
  // If deploying to a custom domain or <username>.github.io, use '/'
  base: '/',
})
