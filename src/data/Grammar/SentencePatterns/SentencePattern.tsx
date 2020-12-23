import React, {useEffect, useState} from "react";
import {MDXProvider} from "@mdx-js/react"
import {H5, H6} from "../../../General/Components/Headers";
import {Paragraph} from "../../../General/Components/Paragraph";

type Props = {
  sentencePattern: string
}

export const SentencePattern: React.FC<Props> = props => {
  const [content, setContent] = useState(<div>Loading..</div>)
  useEffect(() => {
    import(`./${props.sentencePattern}/${props.sentencePattern}.mdx`)
      .then(component => {
        setContent(React.createElement(component.default))
      })
      .then(() => {
        window.scrollTo(0, 0)
      })
  }, [props.sentencePattern])
  const components = {
    h5: H5,
    h6: H6,
    p: Paragraph
  }
  return <MDXProvider components={components}>
    {content}
  </MDXProvider>
}