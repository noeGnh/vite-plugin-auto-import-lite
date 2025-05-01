import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'

process.env.NODE_ENV
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
  resolve: {
    alias: {
      plugin:
        process.env.NODE_ENV === 'production'
          ? 'plugin'
          : 'plugin/src/index.ts',
    },
  },
  build: {
    minify: false,
    rollupOptions: {
      //
    },
  },
  optimizeDeps: {
    exclude: ['plugin'],
  },
  server: {
    port: 4320,
  },
})
