import React, {useState} from "react";
import {Language, languages} from "../../data/Language";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

type Props = {
  language: Language,
  onSelected: (language: Language) => void
}

export const LanguageSelector: React.FC<Props> = props => {
  const [language, setLanguage] = useState<Language>(props.language)

  return <Select
    value={language}
    name={"language"}
    onChange={event => {
      setLanguage(event.target.value as Language)
      props.onSelected(event.target.value as Language)
    }}
    fullWidth={true}
    variant={"outlined"}
  >
    {languages.map(language => {
      return <MenuItem value={language}>{language}</MenuItem>
    })}
  </Select>
}