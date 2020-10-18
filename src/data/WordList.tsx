import {Word} from "./Word";
import wordListN5 from "./wordlist-N5[0].json";

export type WordList = {
  name: string,
  words: Word[],
  version: number,
  description: string,
  wordCount: number
}

const loadWordListVersion1 = () => {
  // @ts-ignore
  return wordListN5 as WordList;
}

export const availableWordLists = [loadWordListVersion1()]