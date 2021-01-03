import React, {useContext} from "react";
import {LiveError, LivePreview, LiveProvider} from "react-live";
import {getCode} from "../MDXUtils";
import {wordNoteContentMDXComponents, WordNoteContentMDXProvider} from "../../data/WordNotes/WordNoteContent";
import {mdx} from "@mdx-js/react";
import {LanguageContext} from "../../data/Language";

type Props = {
  content: string
}

export const WordNoteContentPreview: React.FC<Props> = props => {
  const language = useContext(LanguageContext)

  return <WordNoteContentMDXProvider>
    <LiveProvider
      code={getCode(props.content, wordNoteContentMDXComponents, language)}
      scope={Object.assign({mdx}, wordNoteContentMDXComponents)}
      transformCode={code => '/** @jsx mdx */' + code}
    >
      <LiveError />
      <LivePreview />
    </LiveProvider>
  </WordNoteContentMDXProvider>
}