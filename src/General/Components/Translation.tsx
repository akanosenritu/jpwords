import React, {useContext} from "react";
import {initialConfigurations, useConfigurations} from "../../LocalStorage/Configurations";
import {LanguageContext} from "../../data/Language";

type Props = {
  language: string,
  children: any
}

export const Translation: React.FC<Props> = props => {
  const {configurations} = useConfigurations(initialConfigurations)
  if (configurations.language === props.language) return props.children
  return <></>
}

export const EnglishTranslation: React.FC = props => {
  const language = useContext(LanguageContext)
  return <>
    {language === "ENG" && props.children}
  </>
}

export const SpanishTranslation: React.FC = props => {
  const language = useContext(LanguageContext)
  return <>
    {language === "ESP" && props.children}
  </>
}