import React, {lazy, Suspense} from "react";

type Props = {
  sentencePattern: string
}

export const SentencePattern: React.FC<Props> = props => {
  const Content = lazy(() => import(`./${props.sentencePattern}/${props.sentencePattern}.mdx`))
  return <Suspense fallback={<div>loading</div>}>
    <Content />
  </Suspense>
}