import React from "react";
import {WordType} from "./Word";


type WordContextType = {
  words: WordType[],
  wordsDict: {[wordUUID: string]: WordType}
  load: () => void
  loadFromLocal: () => void,
  loadFromServer: () => void,
}

const defaultWordContextValue: WordContextType = {
  words: [],
  wordsDict: {},
  load: () => {},
  loadFromLocal: () => {},
  loadFromServer: () => {}
}

export const WordContext = React.createContext(defaultWordContextValue)

