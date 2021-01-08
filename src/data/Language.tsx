import React from "react";

export const languages = ["en", "es"]

export type Language = typeof languages[number]

export const LanguageContext = React.createContext<Language>("ENG")

type LanguageProviderProps = {
  language: Language
}

export const LanguageProvider: React.FC<LanguageProviderProps> = props => {
  return <LanguageContext.Provider value={props.language}>
    {props.children}
  </LanguageContext.Provider>
}