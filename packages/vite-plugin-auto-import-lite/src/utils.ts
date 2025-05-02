import fs from 'fs'
import path from 'path'
import { createUnimport, type Import, type PathFromResolver } from 'unimport'

import { Imports } from './types'

export function separatePresetsAndImports(imports: Imports): {
  presets: string[]
  imports: Import[]
} {
  const presets: string[] = []
  const filteredImports: Import[] = []

  for (const item of imports) {
    if (typeof item === 'string') {
      presets.push(item) // All strings become presets
    } else if ('from' in item && 'imports' in item) {
      filteredImports.push(
        ...item.imports.map((imp) => ({
          ...(typeof imp === 'string' ? { name: imp } : imp),
          from: item.from,
        }))
      )
    } else {
      filteredImports.push(item)
    }
  }

  return { presets, imports: filteredImports }
}

export async function generateEslintrc(
  filepath: string,
  imports: Import[],
  globalsPropValue: boolean | 'readonly' | 'writable' = true
) {
  const globals = imports.reduce<
    Record<string, boolean | 'readonly' | 'writable'>
  >((acc, curr) => {
    acc[curr.name] = globalsPropValue
    return acc
  }, {})

  const content = JSON.stringify({ globals }, null, 2)

  fs.mkdirSync(path.dirname(filepath), { recursive: true })
  fs.writeFileSync(filepath, content, 'utf8')
}

export async function generateDts(
  dtsPath: string,
  unimport: ReturnType<typeof createUnimport>,
  warn: (message: string) => void
): Promise<void> {
  const resolvedDts = path.resolve(process.cwd(), dtsPath)
  try {
    const resolvePath: PathFromResolver = (_import) => {
      const importee = typeof _import === 'string' ? _import : _import.from
      if (importee.startsWith(process.cwd())) {
        return (
          './' +
          path
            .relative(
              path.dirname(resolvedDts),
              importee.replace(/\.(js|ts)$/, '')
            )
            .replace(/\\/g, '/')
        )
      }
      return importee
    }

    const content = await unimport.generateTypeDeclarations({
      exportHelper: true,
      resolvePath,
    })
    fs.mkdirSync(path.dirname(resolvedDts), { recursive: true })
    fs.writeFileSync(resolvedDts, content, 'utf8')
  } catch (err) {
    warn(`Failed to generate dts file at ${resolvedDts}: ${err}`)
  }
}
