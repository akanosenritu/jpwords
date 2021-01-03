import React from 'react'
import {MDXProvider} from "@mdx-js/react"
import MDX from "@mdx-js/runtime"
import {Ruby} from "../General/Components/Ruby";

const components = {
  pre: (props: any) => <div {...props} />,
  Ruby: (props: any) => <Ruby {...props} />
}

const mdx = `
### H3
#### H4

<button> hi </button>
<Ruby t="あか">赤</Ruby>
`

export const Test = (props: any) => (
  <MDXProvider components={components}>
    <MDX>
      {mdx}
    </MDX>
  </MDXProvider>
)

