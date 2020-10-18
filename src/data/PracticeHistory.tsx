export type PracticeHistory = {
  lastPracticeDate : Date,
  wordsReviewed: number[],
  wordsNeedsReview: number[],
}

export const createBlankHistory: () => PracticeHistory = () => {
  return {
    lastPracticeDate: new Date(),
    wordsNeedsReview: [],
    wordsReviewed: []
  }
}