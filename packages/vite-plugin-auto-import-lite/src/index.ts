import { createFilter } from '@rollup/pluginutils'
import { parse as parseVue } from '@vue/compiler-sfc'
import path from 'path'
import { createUnimport, Preset, scanDirExports } from 'unimport'
import type { Plugin } from 'vite'

import { AutoImportOptions } from './types'
import {
  generateDts,
  generateEslintrc,
  separatePresetsAndImports,
} from './utils'

export default function AutoImportPlugin(
  options: AutoImportOptions = {}
): Plugin {
  const {
    imports = [],
    dirs = [],
    dts = 'auto-imports.d.ts',
    include,
    exclude = /node_modules/,
    vueTemplate = false,
    eslintrc = {},
  } = options

  const {
    enabled: eslintEnabled = false,
    filepath: eslintFilepath = './.eslintrc-auto-import.json',
    globalsPropValue: eslintGlobalsValue = true,
  } = eslintrc

  const defaultInclude = vueTemplate ? /\.[jt]sx?$|\.vue$/ : /\.[jt]sx?$/
  const filter = createFilter(include ?? defaultInclude, exclude)

  const { presets, imports: regularImports } =
    separatePresetsAndImports(imports)
  const unimport = createUnimport({
    presets: presets as unknown as Preset[],
    imports: regularImports,
  })

  return {
    name: 'vite:auto-import-lite',
    enforce: 'pre',

    async buildStart() {
      if (dirs.length) {
        const scanned = await scanDirExports(dirs)
        await unimport.modifyDynamicImports(() => Promise.resolve(scanned))
      }

      if (dts && typeof dts === 'string') {
        await generateDts(dts, unimport, this.warn)
      }

      if (eslintEnabled) {
        const resolvedEslintrcPath = path.resolve(process.cwd(), eslintFilepath)
        try {
          await generateEslintrc(
            resolvedEslintrcPath,
            regularImports,
            eslintGlobalsValue
          )
          this.info(`Generated ESLint config at ${resolvedEslintrcPath}`)
        } catch (err) {
          this.warn(`Failed to generate ESLint config: ${err}`)
        }
      }
    },

    async transform(code, id) {
      if (!filter(id)) return null

      if (vueTemplate && id.endsWith('.vue')) {
        const sfc = parseVue(code)
        const { descriptor } = sfc
        let hasChanged = false
        let newCode = code

        if (descriptor.scriptSetup) {
          const { scriptSetup } = descriptor
          const result = await unimport.injectImports(scriptSetup.content, id)
          if (result.code !== scriptSetup.content) {
            hasChanged = true
            newCode =
              code.slice(0, scriptSetup.loc.start.offset) +
              result.code +
              code.slice(scriptSetup.loc.end.offset)
          }
        }

        return hasChanged ? newCode : null
      }

      const result = await unimport.injectImports(code, id)
      return result.code
    },
  }
}
