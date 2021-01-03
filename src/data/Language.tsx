import React from "react";

export const languages = ["ENG", "ESP"]

export type Language = typeof languages[number]

export const isLanguage = (value: any): value is Language  => {
  if (typeof value !== "string") return false
  if (value === "ENG") return true
  else if (value === "ESP") return true
  return false
}

export const LanguageContext = React.createContext<Language>("ENG")

type LanguageProviderProps = {
  language: Language
}

export const LanguageProvider: React.FC<LanguageProviderProps> = props => {
  return <LanguageContext.Provider value={props.language}>
    {props.children}
  </LanguageContext.Provider>
}