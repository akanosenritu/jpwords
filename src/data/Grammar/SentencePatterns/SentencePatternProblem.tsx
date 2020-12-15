import React, {lazy, Suspense} from "react";

type Props = {
  sentencePattern: string,
  index: number
}

export const SentencePatternProblem: React.FC<Props> = props => {
  const Content = lazy(() => import(`./${props.sentencePattern}/${props.index}.mdx`))
  return <Suspense fallback={<div>loading</div>}>
    <Content />
  </Suspense>
}