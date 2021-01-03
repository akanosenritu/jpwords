import React, {useContext} from "react";
import {Language, LanguageContext} from "../../data/Language";

type Props = {
  [lang in Language]: React.ReactElement
}
export const Translate: React.FC<Props> = props => {
  const language = useContext(LanguageContext)
  if (props[language]) return props[language]
  return <>{props.children}</>
}