import {get, post} from "./API";
import {PracticeHistory} from "../data/PracticeHistory";
import {AuthenticatedUser} from "../data/User";

export type APIPracticeHistoryType = {
  last_update_date: string,
  version: number,
  data: string
}

export const retrievePracticeHistory = (user: AuthenticatedUser): Promise<PracticeHistory> => {
  return get("practice-history/")
    .then(res => res.json())
    .then(data => {
      return data as APIPracticeHistoryType
    })
    .then(data => {
      const practiceHistory = {
        userName: user.username,
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

export const savePracticeHistoryRemotely = (practiceHistory: PracticeHistory, user: AuthenticatedUser) => {
  if (practiceHistory.userName && user.username !== practiceHistory.userName) throw new Error("Cannot save practice history for a different user.")
  const postData: APIPracticeHistoryType = {
    last_update_date: practiceHistory.lastPracticeDate,
    version: practiceHistory.version,
    data: JSON.stringify(practiceHistory.wordsHistory)
  }
  post("practice-history/", postData)
    .then(res => {
      console.log("Practice History saved in the server.")
    })
    .catch(err => {
      console.log("Failed to save practice history in the server.")
      console.log(err)
    })
}