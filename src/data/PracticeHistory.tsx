import {Word} from "./Word";
import {WordList} from "./WordList";

export type PracticeHistory = {
  lastPracticeDate : string,
  wordListName: string,
  memorizationStrength: number[]  // 5 (better) <==> 0
}

export const createBlankHistory: (wordList: WordList) => PracticeHistory = (wordList) => {
  return {
    lastPracticeDate: new Date().toISOString(),
    wordListName: "N5",
    memorizationStrength: new Array(wordList.wordCount).fill(0)
  }
};

export const updatePracticeHistory = (practiceHistory: PracticeHistory, correctlyAnsweredWords: Word[], wronglyAnsweredWords: Word[]) => {
  const correctWords = correctlyAnsweredWords.map(word => word.num);
  const wrongWords = wronglyAnsweredWords.map(word => word.num);
  let updatedMemorizationStrength = practiceHistory.memorizationStrength;
  correctWords.forEach(wordNum => {
    const newStrength = updatedMemorizationStrength[wordNum] + 2;
    updatedMemorizationStrength[wordNum] = newStrength > 5? 5: newStrength;
  });
  wrongWords.forEach(wordNum => {
    const newStrength = updatedMemorizationStrength[wordNum] - 1;
    updatedMemorizationStrength[wordNum] = newStrength < 1? 1: newStrength;
  });
  const newHistory = practiceHistory;
  newHistory.memorizationStrength = updatedMemorizationStrength;
  return newHistory;
};


export const loadPracticeHistory: (wordList: WordList) => PracticeHistory = (wordList) => {
  const localStorage = window.localStorage;
  const keyName = wordList.name + "-practiceHistory";
  const history = localStorage.getItem(keyName);
  if (history) return JSON.parse(history) as PracticeHistory;
  else {
    let newHistory = createBlankHistory(wordList);
    localStorage.setItem(keyName, JSON.stringify(newHistory));
    return newHistory;
  }
};

export const savePracticeHistory = (wordList: WordList, practiceHistory: PracticeHistory) => {
  const localStorage = window.localStorage;
  const keyName = wordList.name + "-practiceHistory";
  localStorage.setItem(keyName, JSON.stringify(practiceHistory));
};

export const chooseWordsToPractice = (wordList: WordList, practiceHistory: PracticeHistory, quantity: number) => {
  let wordsByMemoryStrength = [[] as Word[], [] as Word[], [] as Word[], [] as Word[], [] as Word[], [] as Word[],];
  wordList.words.forEach(word => {
    const strength = practiceHistory.memorizationStrength[word.num];
    wordsByMemoryStrength[strength].push(word)
  });
  console.log(wordsByMemoryStrength);
  let res = [] as Word[];
  for (let i=1; i<6; i++){
    res = res.concat(wordsByMemoryStrength[i]);
    if (res.length >= quantity) return res.slice(0, quantity);
  }
  res = res.concat(wordsByMemoryStrength[0]);
  return res;
};