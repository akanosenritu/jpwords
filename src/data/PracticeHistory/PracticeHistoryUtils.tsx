import {PracticeHistoryVLatest} from "./PracticeHistory";
import {WordListLoaded} from "../WordLists/WordList";
import {WordType} from "../Word/Word";
import {shuffle} from "lodash";

const TIME_FACTOR = 24 * 60 * 60 * 1000;

export const updatePracticeHistoryWithPracticeResult = (practiceHistory: PracticeHistoryVLatest, wordIdsPracticed: string[], practiceQualities: number[]) => {
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
      updatedWordsHistory[wordIdPracticed][1] += 1
      let newStrength = calculateStrength(updatedWordsHistory[wordIdPracticed][2], practiceQuality);
      if (newStrength < 0) newStrength = 0;
      updatedWordsHistory[wordIdPracticed][2] = newStrength;
      updatedWordsHistory[wordIdPracticed][0] = calculateNextPracticeDate(newStrength, updatedWordsHistory[wordIdPracticed][1], TIME_FACTOR).toISOString();
    } else {
      const strength = calculateStrength(2.5, practiceQuality);
      updatedWordsHistory[wordIdPracticed] = [
        calculateNextPracticeDate(strength, 1, TIME_FACTOR).toISOString(),
        1,
        strength
      ]
    }
  })
  const newHistory = practiceHistory;
  newHistory.wordsHistory = updatedWordsHistory;
  newHistory.lastPracticeDate = new Date().toISOString();
  return newHistory;
};

export const chooseWordsToPractice = (wordList: WordListLoaded, practiceHistory: PracticeHistoryVLatest, quantity: number): WordType[] => {
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
    const nextPracticeDate = new Date(wordHistory[0]);
    if (wordHistory[1] === 0) {
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

type CalculateProgressForWordListResult = {
  countReviewed: number,
  countNeedsReview: number,
  countUntouched: number,
  progress: number
}

export const calculateProgressForWordList = (practiceHistory: PracticeHistoryVLatest, wordList: WordListLoaded): CalculateProgressForWordListResult => {
  let countReviewed = 0;
  let countNeedsReview = 0;
  let countUntouched = 0;
  for (let word of wordList.words) {
    // @ts-ignore
    const wordHistory = practiceHistory.wordsHistory[word.uuid];
    if (wordHistory === undefined) {
      countUntouched += 1
      continue
    }
    if (wordHistory[1] === 0) {
      countUntouched += 1
      continue
    }
    const nextPracticeDate = new Date(wordHistory[0]);
    if (nextPracticeDate.getTime() - Date.now() > 0) {
      countReviewed += 1
    } else {
      countNeedsReview += 1
    }
  }
  const progress = 100 * (countNeedsReview + countReviewed) / wordList.wordCount;
  return {
    countReviewed,
    countNeedsReview,
    countUntouched,
    progress
  }
}