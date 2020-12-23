import React, {useCallback, useContext, useEffect, useState} from "react";
import {loadWordListsForLanguage, WordList} from "./WordList";
import {WordContext} from "../Word/WordProvider";
import {initialConfigurations, useConfigurations} from "../Storage/Configurations";


type WordListsContextType = {
  wordLists: WordList[]
}

const defaultWordListsContextValue: WordListsContextType = {
  wordLists: []
}

export const WordListsContext = React.createContext<WordListsContextType>(defaultWordListsContextValue)

export const WordListsProvider: React.FC = props => {
  const {configurations} = useConfigurations(initialConfigurations)
  const [wordLists, setWordLists] = useState(defaultWordListsContextValue.wordLists)
  const {wordsDict} = useContext(WordContext)

  const load = useCallback(() => {
    loadWordListsForLanguage(configurations.language, wordsDict)
      .then(data => {
        setWordLists(data)
      })
  }, [wordsDict, configurations.language])

  // initial load, reload after the wordsDict changes.
  useEffect(() => {
    load()
  }, [load, wordsDict])

  return <WordListsContext.Provider value={{wordLists}}>
    {props.children}
  </WordListsContext.Provider>
}
