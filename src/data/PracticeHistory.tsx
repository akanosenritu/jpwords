import {WordType} from "./Word/Word";
import {WordList} from "./WordLists/WordList";
import {shuffle} from "lodash";
import {loadPracticeHistoryFromLocalStorage, savePracticeHistoryLocally} from "./Storage/PracticeHistory";
import {retrievePracticeHistory, savePracticeHistoryRemotely} from "../API/APIPracticeHistory";
import {User} from "./User";

const TIME_FACTOR = 24 * 60 * 60 * 1000;

export type WordHistoryV2 = {
  nextPracticeDate: string,
  nPractices: number,
  strength: number
}

export type PracticeHistory = {
  lastPracticeDate: string,
  wordsHistory: {[key: string]: WordHistoryV2},
  userName?: string,
  version: number
}

export const createBlankHistory: () => PracticeHistory = () => {
  return {
    lastPracticeDate: new Date().toISOString(),
    version: 0.3,
    wordsHistory: {}
  } as PracticeHistory
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

export const loadPracticeHistory: (user: User) => Promise<PracticeHistory> = async (user: User) => {
  let localHistory: null | PracticeHistory = null
  let remoteHistory: null | PracticeHistory = null
  try {
    localHistory = loadPracticeHistoryFromLocalStorage()
  } catch (e) {
    localHistory = createBlankHistory()
  }
  if (user.status === "Authenticated") {
    try {
      remoteHistory = await retrievePracticeHistory(user)
    } catch(e) {
      console.log(e)
    }
  }
  console.log(localHistory, remoteHistory)
  if (localHistory === null && remoteHistory === null) return createBlankHistory()
  if (localHistory === null && remoteHistory !== null) return remoteHistory
  if (localHistory !== null && remoteHistory === null) return localHistory
  // for the moment local data gets the priority.
  return localHistory as PracticeHistory
};

export const savePracticeHistory = (practiceHistory: PracticeHistory, user: User) => {
  savePracticeHistoryLocally(practiceHistory)
  if (user.status === "Authenticated") {
    savePracticeHistoryRemotely(practiceHistory, user)
  }
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
