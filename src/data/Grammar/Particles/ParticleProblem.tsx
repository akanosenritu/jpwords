import React, {lazy, Suspense} from "react";

type Props = {
  particle: string,
  index: number
}

export const ParticleProblem: React.FC<Props> = props => {
  const Content = lazy(() => import(`./ParticlePractices/${props.particle}/${props.index}.mdx`))
  return <Suspense fallback={<div>loading</div>}>
    <Content />
  </Suspense>
}