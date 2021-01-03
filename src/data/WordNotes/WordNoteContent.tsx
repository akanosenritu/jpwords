import React, {lazy, Suspense} from 'react'
import {MDXProvider} from "@mdx-js/react";
import {Ruby} from "../../General/Components/Ruby";
import {EnglishTranslation, SpanishTranslation} from "../../General/Components/Translation";

type WordNoteContentProps = {
  uuid: string
}

export const WordNoteContent: React.FC<WordNoteContentProps> = (props) => {
  const Content = lazy(()=> import(`./Contents/${props.uuid}.mdx`))
  return <Suspense fallback={<div>...loading</div>} >
    <WordNoteContentMDXProvider>
      <Content />
    </WordNoteContentMDXProvider>
  </Suspense>
}

export const wordNoteContentMDXComponents = {
  Ruby: (props: any) => <Ruby {...props} />,
  script: () => <p>SCRIPT TAG IS NOT ALLOWED</p>,
  ENG: (props: any) => <EnglishTranslation {...props} />,
  ESP: (props: any) => <SpanishTranslation {...props} />
}

export const WordNoteContentMDXProvider: React.FC = props => {
  return <MDXProvider components={wordNoteContentMDXComponents}>
    {props.children}
  </MDXProvider>
}