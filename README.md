# vite-plugin-auto-import-lite [![npm](https://img.shields.io/npm/v/vite-plugin-auto-import-lite)](https://npmjs.com/package/vite-plugin-auto-import-lite)

A lightweight Vite plugin based on [unimport](https://github.com/unjs/unimport) for automatic imports with presets support, TypeScript declarations, and ESLint integration.

## Features

- 🔌 **Zero-config presets** for Vue, Pinia, Vue Router, etc.
- 🛠 **Custom imports** with flexible syntax
- 📝 **TypeScript support** with `.d.ts` generation
- 🔍 **ESLint integration** to prevent undefined warnings
- ⚡ **Vue template support** for SFC auto-imports
- 🗂 **Directory scanning** for dynamic imports

## Installation

```bash
npm install vite-plugin-auto-import-lite -D
# or
pnpm add vite-plugin-auto-import-lite -D
# or
yarn add vite-plugin-auto-import-lite --dev
```

## Usage

### Basic Setup

```ts
// vite.config.ts
import AutoImport from 'vite-plugin-auto-import-lite'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: [
        'vue', // preset
        'pinia', // preset
        { from: 'axios', imports: ['get', 'post'] }, // named imports
        { name: 'default', from: 'my-lib', as: 'myLib' } // default import
      ],
    })
  ]
})
```

### Full Configuration

```ts
AutoImport({
  // Array of imports (strings = presets)
  imports: [
    'vue',
    { from: 'vue-router', imports: ['useRoute'] },
    { name: 'fetch', from: 'node-fetch' }
  ],

  // Directories to scan for auto-imports
  dirs: ['./src/composables', './src/utils'],

  // TypeScript declaration file config
  dts: 'types/auto-imports.d.ts', // or `false` to disable

  // Vue template support
  vueTemplate: true,

  // ESLint config generation
  eslintrc: {
    enabled: true, // Default: false
    filepath: './.eslintrc-auto-import.json', // Default
    globalsPropValue: 'readonly' // Default: true
  },

  // File inclusion/exclusion
  include: [/\.[jt]sx?$/, /\.vue$/],
  exclude: [/node_modules/]
})
```

## Presets

All string entries in `imports` are treated as presets. Supported presets is [unimport presets](https://github.com/unjs/unimport/tree/main/src/presets).

## TypeScript Support

Enable type declarations with:

```ts
AutoImport({
  dts: true // generates 'auto-imports.d.ts' by default
})
```

## ESLint Integration

To prevent ESLint "no-undef" errors:

1. Enable config generation:

    ```ts
    eslintrc: {
        enabled: true
    }
    ```

2. Extend the generated config in your ESLint config:

    ```js
    // .eslintrc.js
    module.exports = {
    extends: [
        // ...other configs
        './.eslintrc-auto-import.json'
    ]
    }
    ```

## Vue Template Support

Enable automatic imports in `<template>` blocks:

```ts
AutoImport({
  vueTemplate: true
})
```

This will auto-import components, directives, and composables used in templates.

## Directory Scanning

Scan directories for exports to auto-import:

```ts
AutoImport({
  dirs: [
    './src/composables',
    './src/stores'
  ]
})
```

## Comparison with unplugin-auto-import

This plugin offers a lighter-weight alternative with:

- Simplified configuration
- Focus on Vite-specific optimizations

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/noeGnh/vite-plugin-auto-import-lite/releases).

## License

[MIT](https://github.com/noeGnh/vite-plugin-auto-import-lite/blob/master/LICENSE)
