import {prepareWordV2, WordType} from "./Word";
import wordListN4 from "./wordlist-N4[1].json";
import wordListN5 from "./wordlist-N5[1].json";

export type WordList = {
  name: string,
  words: WordType[],
  version: number,
  description: string,
  wordCount: number
}

const loadWordListVersion1 = (target: any) => {
  const wordList = {
    name: target.name,
    version: target.version,
    description: target.description,
    wordCount: target.wordCount,
    words: prepareWordV2(target.words)
  } as WordList;
  return wordList
};

export const availableWordLists = [loadWordListVersion1(wordListN5), loadWordListVersion1(wordListN4)];