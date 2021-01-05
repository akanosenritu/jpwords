import React, {useCallback, useContext, useEffect, useState} from "react";
import {loadWordListsForLanguage, WordList, WordListInitial, WordListLoaded} from "./WordList";
import {WordContext} from "../Word/WordProvider";
import {initialConfigurations, useConfigurations} from "../../LocalStorage/Configurations";
import {defaultValueFailure, Failure, SuccessWithData} from "../../General/Result";


type WordListsContextType = {
  wordLists: WordList[],
  loadWords: (wordListInitial: WordListInitial) => Promise<SuccessWithData<WordListLoaded>|Failure>,
}

const defaultWordListsContextValue: WordListsContextType = {
  wordLists: [],
  loadWords: () => Promise.resolve(defaultValueFailure)
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

  const loadWords = async (wordListInitial: WordListInitial) => {
    const wordListLoaded = wordListInitial.load()
    setWordLists(wordLists => {
      const index = wordLists.findIndex(wordList => wordList.uuid === wordListLoaded.uuid)
      if (index === -1) return wordLists.concat([wordListLoaded])
      const newWordLists = [...wordLists]
      newWordLists[index] = wordListLoaded
      return newWordLists
    })
    return {
      status: "success" as const,
      data: wordListLoaded
    }
  }

  // initial load, reload after the wordsDict changes.
  useEffect(() => {
    load()
  }, [load, wordsDict])

  return <WordListsContext.Provider value={{wordLists, loadWords}}>
    {props.children}
  </WordListsContext.Provider>
}
