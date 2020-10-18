import {prepareWord2, Word} from "./Word";
import wordListN5 from "./wordlist-N5[0].json";

export type WordList = {
  name: string,
  words: Word[],
  version: number,
  description: string,
  wordCount: number
}

const loadWordListVersion1 = () => {
  const wordList = {
    name: wordListN5.name,
    version: wordListN5.version,
    description: wordListN5.description,
    wordCount: wordListN5.wordCount,
    words: prepareWord2(wordListN5.words)
  } as WordList;
  return wordList
};

export const availableWordLists = [loadWordListVersion1()];