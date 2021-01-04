import React, {useContext} from "react";
import {LanguageContext} from "../../data/Language";
import {wordNoteContentMDXComponents, WordNoteContentMDXProvider} from "../../data/WordNotes/WordNoteContent";
import {LiveEditor, LiveError, LivePreview, LiveProvider} from "react-live";
import {getCode} from "../MDXUtils";
import {mdx} from "@mdx-js/react";

type Props = {
  content: string
}

export const WordNoteContentEditor: React.FC<Props> = props => {
  const language = useContext(LanguageContext)
  return <WordNoteContentMDXProvider>
    <LiveProvider
      code={getCode(props.content, wordNoteContentMDXComponents, language)}
      scope={Object.assign({mdx}, wordNoteContentMDXComponents)}
      transformCode={code => '/** @jsx mdx */' + code}
    >
      <LiveEditor />
    </LiveProvider>
  </WordNoteContentMDXProvider>
}