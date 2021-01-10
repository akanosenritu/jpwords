import React from "react"

import ReactSelect from "react-select"
import {Language, languages} from "../../../data/Language"

type LanguageSelectorProps = {
  selected: Language,
  onSelect: (language: Language) => void
}

type Option = {label: string, value: Language}
const languageOptions: Option[] = languages.map(language => {
  return {
    label: language,
    value: language
  }
})

export const LanguageSelector: React.FC<LanguageSelectorProps> = props => {
  const onSelect = (selected: Option | Option[]) => {
    if (Array.isArray(selected)) {
      throw new Error("expected an option, but instead got option[].")
    }
    props.onSelect(selected.value as Language)
    console.log(selected.value)
  }
  const styles = {
    control: (base: any) => ({...base, backgroundColor: "inherit"})
  }
  // @ts-ignore
  return <ReactSelect options={languageOptions} onChange={onSelect} styles={styles} />
}

type MultipleLanguageSelectorProps = {
  selected: Language[],
  onSelect: (languages: Language[]) => void
}
export const MultipleLanguageSelector: React.FC<MultipleLanguageSelectorProps> = props => {
  const onSelect = (selected: Option | Option[]) => {
    if (!Array.isArray(selected)) {
      throw new Error("expected an array of options, but instead got an option.")
    }
    props.onSelect(selected.map(selected => selected.value as Language))
  }
  // @ts-ignore
  return <ReactSelect options={languageOptions} onChange={onSelect} isMulti={true} placeholder={"Select languages"}/>
}