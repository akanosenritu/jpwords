import {get, getWithToken, post, postWithToken, put} from "./API";
import {user} from "../data/User";
import {PracticeHistory} from "../data/PracticeHistory";

export type APIPracticeHistoryType = {
  last_update_date: string,
  version: number,
  data: string
}

export const retrievePracticeHistory = (): Promise<PracticeHistory> => {
  if (!user.isLoggedIn()) throw new Error("There is no practice history for an anonymous user.")
  if (!user.token) throw new Error("User Token was not set.")
  return getWithToken("practice-history/", user.token)
    .then(res => res.json())
    .then(data => {
      return data as APIPracticeHistoryType
    })
    .then(data => {
      const practiceHistory = {
        userName: user.userName,
        version: data.version,
        lastPracticeDate: data.last_update_date,
        wordsHistory: JSON.parse(data.data)
      }
      return practiceHistory as PracticeHistory
    })
    .catch(err => {
      console.log("Retrieval of practice history failed.")
      console.log(err)
      throw err
    })
}

export const savePracticeHistoryRemotely = (practiceHistory: PracticeHistory) => {
  if (!user.isLoggedIn()) throw new Error("Practice history for an anonymous user cannot be saved.")
  if (!user.token) throw new Error("User Token was not set.")
  if (practiceHistory.userName && user.userName !== practiceHistory.userName) throw new Error("Cannot save practice history for a different user.")
  const postData: APIPracticeHistoryType = {
    last_update_date: practiceHistory.lastPracticeDate,
    version: practiceHistory.version,
    data: JSON.stringify(practiceHistory.wordsHistory)
  }
  postWithToken("practice-history/", user.token, postData)
    .then(res => {
      console.log("Practice History saved in the server.")
    })
    .catch(err => {
      console.log("Failed to save practice history in the server.")
      console.log(err)
    })
}