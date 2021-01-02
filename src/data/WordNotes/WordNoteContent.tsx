import React, {lazy, Suspense} from 'react'

type WordNoteContentProps = {
  uuid: string
}

export const WordNoteContent: React.FC<WordNoteContentProps> = (props) => {
  const Content = lazy(()=> import(`./Contents/${props.uuid}.mdx`))
  return <Suspense fallback={<div>...loading</div>} >
    <Content />
  </Suspense>
}