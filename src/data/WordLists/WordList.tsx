import {prepareWordV2, WordType} from "../Word/Word";
import wordListN4 from "./wordlist-N4[1].json";
import wordListN5 from "./wordlist-N5[1].json";
import {isLanguage, Language} from "../Language";

export type WordList = {
  name: string,
  language: Language,
  words: WordType[],
  version: number,
  description: string,
  wordCount: number
}

const loadWordListVersion1 = (target: any) => {
  return {
    name: target.name,
    language: target.language,
    version: target.version,
    description: target.description,
    wordCount: target.wordCount,
    words: prepareWordV2(target.words)
  } as WordList
};

const availableWordLists: {[lang in Language]: WordList[]} = {
  "ENG": [loadWordListVersion1(wordListN5), loadWordListVersion1(wordListN4)],
  "ESP": []
};

export const getAvailableWordLists = (language: string): WordList[] => {
  if (isLanguage(language)) return availableWordLists[language]
  return []
}

const isWordUsed = (wordList: WordList, word: WordType) => {
  const wordUUIDsUsedInWordList = wordList.words.map(word => word.uuid);
  return wordUUIDsUsedInWordList.includes(word.uuid);
}

export const searchWordInAvailableWordLists = (word: WordType, language: Language): WordList[] => {
  return availableWordLists[language].filter(wordList => isWordUsed(wordList, word))
}