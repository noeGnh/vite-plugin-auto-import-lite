import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import AutoImportLite from 'vite-plugin-auto-import-lite'

export default defineConfig({
  plugins: [
    vue(),
    AutoImportLite({
      imports: ['vue'],
      vueTemplate: true,
    }),
  ],
  resolve: {
    dedupe: ['vue'],
  },
  build: {
    minify: false,
    rollupOptions: {
      //
    },
  },
})
