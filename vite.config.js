import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Served from the custom domain root (clawrouter.qzz.io) — base is '/'.
  // (publish-docs.sh also preserves a base:'/' config on the remote repo.)
  base: '/',
  // Scratch copy runs on 5174 so it can be previewed side by side with the original (5173)
  server: { port: 5174 },
  // The prerender SSR bundle runs in plain Node ESM — bundle all deps
  // (some, e.g. @lobehub/icons, use extensionless imports Node can't resolve).
  ssr: { noExternal: true },
})
