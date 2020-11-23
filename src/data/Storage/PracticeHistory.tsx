import {WordType} from "../Word";
import {WordList} from "../WordList";
import {shuffle} from "lodash";

const TIME_FACTOR = 24 * 60 * 60 * 1000;

type WordHistoryV2 = {
  nextPracticeDate: string,
  nPractices: number,
  strength: number
}

export type PracticeHistory = {
  lastPracticeDate: string,
  wordsHistory: {[key: string]: WordHistoryV2},
  version: number
}

export const createBlankHistory: () => PracticeHistory = () => {
  return {
    lastPracticeDate: new Date().toISOString(),
    version: 0.2,
    wordsHistory: {}
  }
};

export const updatePracticeHistory = (practiceHistory: PracticeHistory, wordIdsPracticed: string[], practiceQualities: number[]) => {
  const calculateNextPracticeDate = (strength: number, nPractices: number, timeFactor: number): Date => {
    const l = [] as number[];
    l[1] = 1;
    l[2] = 6;
    for (let i=3; i<=nPractices; i++) {
        l[i] = l[i-1] * strength;
    }
    return new Date(Date.now() + timeFactor * l[nPractices]);
  };
  const calculateStrength = (strengthBefore: number, practiceQuality: number) => {
    let newStrength = strengthBefore + (0.1  - (5 - practiceQuality) * (0.08 + (5 - practiceQuality) * 0.02));
    if (newStrength < 1.3) newStrength = 1.3;
    if (newStrength > 2.5) newStrength = 2.5;
    return newStrength;
  }
  let updatedWordsHistory = practiceHistory.wordsHistory;
  wordIdsPracticed.forEach((wordIdPracticed, index) => {
    const practiceQuality = practiceQualities[index];
    if (updatedWordsHistory[wordIdPracticed] !== undefined) {
      updatedWordsHistory[wordIdPracticed].nPractices += 1
      let newStrength = calculateStrength(updatedWordsHistory[wordIdPracticed].strength, practiceQuality);
      if (newStrength < 0) newStrength = 0;
      updatedWordsHistory[wordIdPracticed].strength = newStrength;
      updatedWordsHistory[wordIdPracticed].nextPracticeDate = calculateNextPracticeDate(newStrength, updatedWordsHistory[wordIdPracticed].nPractices, TIME_FACTOR).toISOString();
    } else {
      const strength = calculateStrength(2.5, practiceQuality);
      updatedWordsHistory[wordIdPracticed] = {
        strength: strength,
        nPractices: 1,
        nextPracticeDate: calculateNextPracticeDate(strength, 1, TIME_FACTOR).toISOString()
      };
    }
  })
  const newHistory = practiceHistory;
  newHistory.wordsHistory = updatedWordsHistory;
  newHistory.lastPracticeDate = new Date().toISOString();
  return newHistory;
};


export const loadPracticeHistory: () => PracticeHistory = () => {
  const localStorage = window.localStorage;
  const keyName = "practiceHistory";
  const possibleHistory = localStorage.getItem(keyName);
  if (possibleHistory) {
    try {
      const history = JSON.parse(possibleHistory) as PracticeHistory;
      if (history.version === 0.2){
        console.log("saved practice history loaded.", history);
        return history;
      }
    } catch {
      console.log("detected practice history, but it is not compatible with this version of app.", JSON.parse(possibleHistory))
    }
  }
  let newHistory = createBlankHistory();
  localStorage.setItem(keyName, JSON.stringify(newHistory));
  console.log("created a new practice history.")
  return newHistory;
};

export const savePracticeHistory = (practiceHistory: PracticeHistory) => {
  const localStorage = window.localStorage;
  const keyName ="practiceHistory";
  localStorage.setItem(keyName, JSON.stringify(practiceHistory));
};

export const chooseWordsToPractice = (wordList: WordList, practiceHistory: PracticeHistory, quantity: number): WordType[] => {
  const words = shuffle(wordList.words);
  const untouchedWords = [] as WordType[];
  const result = [] as WordType[];
  for (let word of words) {
    const wordId = word.uuid;
    const wordHistory = practiceHistory.wordsHistory[wordId];
    if (wordHistory === undefined) {
      untouchedWords.push(word);
      continue
    }
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
  return result.concat(untouchedWords.slice(0, 20)).slice(0, 20);
};

export const getWordHistory = (word: WordType): WordHistoryV2|null => {
  const wordsHistory = loadPracticeHistory().wordsHistory;
  return wordsHistory[word.uuid]? wordsHistory[word.uuid]: null;
}