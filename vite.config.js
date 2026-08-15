import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Note: If deploying to GitHub Pages as a project repository,
// set base to: '/solar/' (repository name)
// If deploying to user/org pages, set base to: '/'
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? '/solar/' : '/',
})
