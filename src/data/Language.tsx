import React, {useState} from "react";

export const languages = ["en", "es"]

export type Language = typeof languages[number]

export const LanguageContext = React.createContext<Language>("en")

type LanguageProviderProps = {
  language: Language
}

export const LanguageProvider: React.FC<LanguageProviderProps> = props => {
  return <LanguageContext.Provider value={props.language}>
    {props.children}
  </LanguageContext.Provider>
}

type LanguageProvider2Value = {
  language: Language,
  setLanguage: (language: Language) => void
}
const defaultLanguageProvider2Value = {
  language: "en",
  setLanguage: () => {}
}

export const LanguageContext2 = React.createContext<LanguageProvider2Value>(defaultLanguageProvider2Value)

type LanguageProvider2Props = {
  language: Language
}

export const LanguageProvider2: React.FC<LanguageProvider2Props> = (props) => {
  const [language, setLanguage] = useState<Language>(props.language)
  return <LanguageContext2.Provider value={{language, setLanguage}}>
    {props.children}
  </LanguageContext2.Provider>
}