import {prepareWordV2, WordType} from "../Word/Word";
import {Language} from "../Language";
import wordListsData from "../GeneratedData/wordLists.json"

type WordListData = {
  [lang in Language]: any
}
const getWordListsData = () => {
  return wordListsData as WordListData
}

type LoadedWordListWords = {
  status: "loaded",
  words: WordType[]
}
type NotLoadedWordListWords = {
  status: "notLoaded"
}

export type WordListLoaded = {
  status: "loaded",
  name: string,
  uuid: string,
  language: Language,
  words: WordType[],
  version: number,
  description: string,
  wordCount: number,
  wordsFiles: string[],
  hidden: boolean,
}

export type WordListInitial = {
  status: "initial",
  name: string,
  uuid: string,
  language: Language,
  load: () => WordListLoaded
  version: number,
  description: string,
  wordUUIDs: string[],
  wordCount: number,
  wordsFiles: string[]
  hidden: boolean,
}

export type WordList = WordListInitial | WordListLoaded

export const loadWordListVersion1 = (target: any, wordsDict: {[key: string]: WordType}): WordListInitial => {
  const obj = {
    status: "initial" as const,
    name: target.name,
    uuid: target.uuid,
    language: target.language,
    version: target.version,
    description: target.description,
    wordUUIDs: target.words,
    wordCount: target.wordCount,
    wordsFiles: ["words.json"],
    hidden: target.hidden
  }
  const load = (): WordListLoaded => {
    const words = prepareWordV2(obj.wordUUIDs, wordsDict)
    return Object.assign(obj, {words, status: "loaded" as const})
  }
  return Object.assign(obj, {load})
};

export const loadWordListVersion1FromFile = (targetFile: string, wordsDict: {[key: string]: WordType}): Promise<WordListInitial> => {
  return import(`../GeneratedData/WordLists/${targetFile}`)
    .then(data => loadWordListVersion1(data, wordsDict))
}

export const loadWordListsForLanguage = async (language: Language, wordsDict: {[key: string]: WordType}): Promise<WordListInitial[]> => {
  return Promise.all(getWordListsData()[language].map((file: string) => loadWordListVersion1FromFile(file, wordsDict)))
}