import {
  PracticeHistory,
  PracticeHistoryVLatest,
  updatePracticeHistoryVersion
} from "../data/PracticeHistory/PracticeHistory";
import {Failure, Success} from "../API/API";
import {User} from "../data/User";

const LOCAL_STORAGE_KEY_NAME = "practiceHistory"

export const savePracticeHistoryLocally = (practiceHistory: PracticeHistoryVLatest) => {
  const localStorage = window.localStorage;
  localStorage.setItem(LOCAL_STORAGE_KEY_NAME, JSON.stringify(practiceHistory));
};

type LoadPracticeHistorySuccess = Success & {
  practiceHistory: PracticeHistoryVLatest
}
export type LoadPracticeHistoryFromLocalStorageResult = LoadPracticeHistorySuccess | Failure

export const loadPracticeHistoryFromLocalStorage = (user: User): LoadPracticeHistoryFromLocalStorageResult => {
  const localStorage = window.localStorage;
  const possibleHistory = localStorage.getItem(LOCAL_STORAGE_KEY_NAME);
  if (possibleHistory) {
    const history = JSON.parse(possibleHistory) as PracticeHistory;
    if (user.status === "Authenticated") {
      if (user.username && history.userName && user.username !== history.userName) {
        return {
          status: "failure",
          reason: "practice history was found, but it was for a different user."
        }
      }
    }
    return {
      status: "success",
      practiceHistory: updatePracticeHistoryVersion(history)
    }
  }
  return {
    status: "failure",
    reason: "No practice history was found."
  }
};