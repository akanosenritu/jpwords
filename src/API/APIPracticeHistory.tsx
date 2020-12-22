import {Failure, get, post, Success} from "./API";
import {
  PracticeHistoryV1,
  PracticeHistoryVLatest,
  updatePracticeHistoryVersion
} from "../data/PracticeHistory/PracticeHistory";
import {AuthenticatedUser, User} from "../data/User";

export type APIPracticeHistoryType = {
  last_update_date: string,
  version: number | string,
  data: string,
  hash: string
}

type RetrievePracticeHistorySuccess = Success & {
  practiceHistory: PracticeHistoryVLatest
}
export type RetrievePracticeHistoryResult = RetrievePracticeHistorySuccess | Failure

export const retrievePracticeHistory = (user: User): Promise<RetrievePracticeHistoryResult> => {
  if (user.status === "Anonymous") {
    return new Promise((resolve) => {
      resolve({
        status: "failure",
        reason: "No practice history saved in the server for an anonymous user."
      })
    })
  }
  return get("practice-history/")
    .then(res => res.json())
    .then(data => {
      return data as APIPracticeHistoryType
    })
    .then(data => {
      const practiceHistory = updatePracticeHistoryVersion({
        userName: user.username,
        version: data.version.toString(),
        lastPracticeDate: data.last_update_date,
        wordsHistory: JSON.parse(data.data),
        hash: data.hash
      } as PracticeHistoryV1)
      return {
        status: "success",
        practiceHistory: practiceHistory
      } as RetrievePracticeHistorySuccess
    })
    .catch(err => {
      return {
        status: "failure",
        reason: "unknown reason"
      } as Failure
    })
}

export type SavePracticeHistoryRemotelyResult = Success | Failure

export const savePracticeHistoryRemotely = (practiceHistory: PracticeHistoryVLatest, user: AuthenticatedUser): Promise<SavePracticeHistoryRemotelyResult> => {
  if (practiceHistory.userName && user.username !== practiceHistory.userName) throw new Error("Cannot save practice history for a different user.")
  const postData: APIPracticeHistoryType = {
    last_update_date: practiceHistory.lastPracticeDate,
    version: practiceHistory.version,
    data: JSON.stringify(practiceHistory.wordsHistory),
    hash: practiceHistory.hash
  }
  return post("practice-history/", postData)
    .then(res => {
      if (res.ok) return {"status": "success"}
      return {
        status: "failure",
        reason: res.statusText
      }
    })
}