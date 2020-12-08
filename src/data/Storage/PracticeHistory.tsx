import {PracticeHistory} from "../PracticeHistory";

const LOCAL_STORAGE_KEY_NAME = "practiceHistory"

export const savePracticeHistoryLocally = (practiceHistory: PracticeHistory) => {
  const localStorage = window.localStorage;
  localStorage.setItem(LOCAL_STORAGE_KEY_NAME, JSON.stringify(practiceHistory));
};

export const loadPracticeHistoryFromLocalStorage: () => PracticeHistory = () => {
  const localStorage = window.localStorage;
  const possibleHistory = localStorage.getItem(LOCAL_STORAGE_KEY_NAME);
  if (possibleHistory) {
    const history = JSON.parse(possibleHistory) as PracticeHistory;
    if (history.version !== 0.2 && history.version !== 0.3) throw new Error("Incompatible practice history version.")
    //    if (user.username && user.username !== history.userName) throw new Error("A Practice history was found locally, but it is for a different user.")
    console.log("saved practice history loaded successfully.", history);
    return history;
  }
  throw new Error("Could not find practice history saved locally.")
};