import {prepareWordV2, WordType} from "../Word/Word";
import {Language} from "../Language";
import wordListsData from "./wordLists.json"


export type WordList = {
  name: string,
  language: Language,
  words: WordType[],
  version: number,
  description: string,
  wordCount: number
  wordsFiles: string[]
}

export const loadWordListVersion1 = (target: any, wordsDict: {[key: string]: WordType}): WordList => {
  return {
    name: target.name,
    language: target.language,
    version: target.version,
    description: target.description,
    wordCount: target.wordCount,
    words: prepareWordV2(target.words, wordsDict),
    wordsFiles: ["words.json"]
  } as WordList
};

export const loadWordListVersion1FromFile = (targetFile: string, wordsDict: {[key: string]: WordType}): Promise<WordList> => {
  return import(`./${targetFile}`)
    .then(data => loadWordListVersion1(data, wordsDict))
}

export const loadWordListsForLanguage = async (language: Language, wordsDict: {[key: string]: WordType}): Promise<WordList[]> => {
  return Promise.all(wordListsData.ENG.map(file => loadWordListVersion1FromFile(file, wordsDict)))
}