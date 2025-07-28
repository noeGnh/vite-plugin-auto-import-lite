import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import AutoImportLite from 'vite-plugin-auto-import-lite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    AutoImportLite({
      imports: ['react'],
      vueTemplate: false,
    }),
  ],
})
