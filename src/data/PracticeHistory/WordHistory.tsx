export type WordHistoryV2 = {
  nextPracticeDate: string,
  nPractices: number,
  strength: number
}

export type WordHistoryV3 = [string, number, number]  // nextPracticeDate, nPractices, strength