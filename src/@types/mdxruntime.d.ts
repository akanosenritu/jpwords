declare module "@mdx-js/runtime" {
  import {FunctionComponent} from 'react'
  import {Options} from '@mdx-js/mdx'
  import {ComponentsProp} from '@mdx-js/react'

  interface MDXRuntimeProps
    extends Omit<Options, 'footnotes' | 'compilers'>,
      Partial<ComponentsProp> {
    /**
     * MDX text
     */
    children?: string

    /**
     * Values in usable in MDX scope
     */
    scope?: {
      [variableName: string]: unknown
    }
  }
  declare const mdxRuntime: FunctionComponent<MDXRuntimeProps>
  export = mdxRuntime
}