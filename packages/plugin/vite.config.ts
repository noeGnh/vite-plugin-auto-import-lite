/// <reference types="vitest"/>
import AutoImport from 'unplugin-auto-import/vite'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    AutoImport({
      // targets to transform
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.md$/, // .md
      ],
      // global imports to register
      imports: [
        // presets
      ],

      // Auto import for module exports under directories
      // by default it only scan one level of modules under the directory
      dirs: [],

      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
    }),
  ],
  build: {
    lib: {
      name: 'Plugin',
      // @ts-ignore
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es', 'cjs', 'iife'],
      fileName: (format) => {
        switch (format) {
          case 'es':
            return 'index.mjs'
          case 'cjs':
            return 'index.cjs'
          case 'iife':
            return 'index.js'
          default:
            return 'index.js'
        }
      },
    },
    minify: false,
    rollupOptions: {
      //
    },
  },
  test: {
    environment: 'jsdom',
  },
})
