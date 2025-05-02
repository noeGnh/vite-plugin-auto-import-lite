import { Import } from 'unimport'

export type Imports = Array<
  string | Import | { from: string; imports: string[] | Import[] }
>

export interface AutoImportOptions {
  imports?: Imports
  dirs?: string[]
  dts?: string | false
  include?: RegExp | RegExp[]
  exclude?: RegExp | RegExp[]
  vueTemplate?: boolean
  eslintrc?: {
    enabled?: boolean
    filepath?: string
    globalsPropValue?: boolean | 'readonly' | 'writable'
  }
}
