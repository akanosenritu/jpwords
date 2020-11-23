import {prepareWordV2, WordType} from "./Word";
import wordListN4 from "./WordLists/wordlist-N4[1].json";
import wordListN5 from "./WordLists/wordlist-N5[1].json";

export type WordList = {
  name: string,
  words: WordType[],
  version: number,
  description: string,
  wordCount: number
}

const loadWordListVersion1 = (target: any) => {
  return {
    name: target.name,
    version: target.version,
    description: target.description,
    wordCount: target.wordCount,
    words: prepareWordV2(target.words)
  } as WordList
};

export const availableWordLists = [loadWordListVersion1(wordListN5), loadWordListVersion1(wordListN4)];

const isWordUsed = (wordList: WordList, word: WordType) => {
  const wordUUIDsUsedInWordList = wordList.words.map(word => word.uuid);
  return wordUUIDsUsedInWordList.includes(word.uuid);
}

export const searchWordInAvailableWordLists = (word: WordType): WordList[] => {
  return availableWordLists.filter(wordList => isWordUsed(wordList, word))
}