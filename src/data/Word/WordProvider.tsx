import React, {useCallback, useEffect, useState} from "react";
import {loadWords, WordType} from "./Word";


type WordContextType = {
  wordsDict: {[wordUUID: string]: WordType}
  load: () => void
  loadFromLocal: () => void,
  loadFromServer: () => void,
}

const defaultWordContextValue: WordContextType = {
  wordsDict: {},
  load: () => {},
  loadFromLocal: () => {},
  loadFromServer: () => {}
}

export const WordContext = React.createContext(defaultWordContextValue)

export const WordProvider: React.FC = props => {
  const [wordsDict, setWordsDict] = useState<{[wordUUID: string]: WordType}>({})
  const loadFromLocal = useCallback(() => {
    loadWords()
      .then(words => {
        setWordsDict(words)
      })
  }, [])
  const loadFromServer = () => {
    throw new Error("loading from the server is yet to be implemented.")
  }
  const load = loadFromLocal

  // initial data load
  useEffect(() => {
    loadFromLocal()
  }, [loadFromLocal])

  return <WordContext.Provider value={{wordsDict, load, loadFromLocal, loadFromServer}}>
    {props.children}
  </WordContext.Provider>
}