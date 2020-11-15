import {Word} from "./Word";
import {WordList} from "./WordList";
import {shuffle} from "lodash";

type WordHistory = {
  nextPracticeDate: string,
  nPractices: number
}
export type PracticeHistory = {
  lastPracticeDate : string,
  wordListName: string,
  version: number
  wordsHistory: WordHistory[]
}

export const createBlankHistory: (wordList: WordList) => PracticeHistory = (wordList) => {
  return {
    lastPracticeDate: new Date().toISOString(),
    wordListName: "N5",
    version: 0.1,
    wordsHistory: wordList.words.map(word=> ({nextPracticeDate: new Date().toISOString(), nPractices: 0}))
  }
};

export const updatePracticeHistory = (practiceHistory: PracticeHistory, correctlyAnsweredWords: Word[]) => {
  const correctWords = correctlyAnsweredWords.map(word => word.num);
  let updatedWordsHistory = practiceHistory.wordsHistory;
  correctWords.forEach(wordNum => {
    updatedWordsHistory[wordNum].nPractices += 1;
    updatedWordsHistory[wordNum].nextPracticeDate = new Date(Date.now() + 3600 * 1000 * updatedWordsHistory[wordNum].nPractices).toISOString();
  });
  const newHistory = practiceHistory;
  newHistory.wordsHistory = updatedWordsHistory;
  return newHistory;
};


export const loadPracticeHistory: (wordList: WordList) => PracticeHistory = (wordList) => {
  const localStorage = window.localStorage;
  const keyName = wordList.name + "-practiceHistory";
  const possibleHistory = localStorage.getItem(keyName);
  if (possibleHistory) {
    try {
      const history = JSON.parse(possibleHistory) as PracticeHistory;
      if (history.version === 0.1) return history;
    } catch {}
  }
  let newHistory = createBlankHistory(wordList);
  localStorage.setItem(keyName, JSON.stringify(newHistory));
  return newHistory;
};

export const savePracticeHistory = (wordList: WordList, practiceHistory: PracticeHistory) => {
  const localStorage = window.localStorage;
  const keyName = wordList.name + "-practiceHistory";
  localStorage.setItem(keyName, JSON.stringify(practiceHistory));
};

export const chooseWordsToPractice = (wordList: WordList, practiceHistory: PracticeHistory, quantity: number): Word[] => {
  const words = shuffle(wordList.words);
  const untouchedWords = [] as Word[];
  const result = [] as Word[];
  for (let word of words) {
    const wordNum = word.num;
    const wordHistory = practiceHistory.wordsHistory[wordNum];
    const nextPracticeDate = new Date(wordHistory.nextPracticeDate);
    if (wordHistory.nPractices === 0) {
      untouchedWords.push(word);
      continue;
    } else if ((nextPracticeDate.getTime() - Date.now()) < 0) {
      result.push(word);
    }

    if (result.length === (quantity - 4)) {
      break
    }
  }
  if (result.length === (quantity - 4)) {
    return result.concat(untouchedWords.slice(0, 4))
  } else {
    return untouchedWords.slice(0, 20)
  }
};