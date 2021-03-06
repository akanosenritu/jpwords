import {loadPracticeHistoryFromLocalStorage, savePracticeHistoryLocally} from "../../LocalStorage/PracticeHistory";
import {retrievePracticeHistory, savePracticeHistoryRemotely} from "../../API/APIPracticeHistory";
import {User} from "../User";
import * as uuid from "uuid"
import {WordHistoryV2, WordHistoryV3} from "./WordHistory";

export type PracticeHistoryV0 = {
  lastPracticeDate: string,
  wordsHistory: {[key: string]: WordHistoryV2},
  userName?: string,
  version: number,
}

export type PracticeHistoryV1 = {
  lastPracticeDate: string,
  wordsHistory: {[key: string]: WordHistoryV2},
  userName?: string,
  version: "1.0",
  hash: string
}

export type PracticeHistoryV2 = {
  lastPracticeDate: string,
  wordsHistory: {[key: string]: WordHistoryV3},
  userName?: string,
  version: "2.0",
  hash: string
}

export type PracticeHistory = PracticeHistoryV0 | PracticeHistoryV1 | PracticeHistoryV2
export type PracticeHistoryVLatest = PracticeHistoryV2

export const createBlankHistory: () => PracticeHistoryVLatest = () => {
  return {
    lastPracticeDate: new Date().toISOString(),
    version: "2.0",
    wordsHistory: {},
    hash: uuid.v4()
  } as PracticeHistoryV2
};

type LoadPracticeHistoryNew = {
  status: "new",
  practiceHistory: PracticeHistoryVLatest
}
type LoadPracticeHistoryLoaded = {
  status: "loaded"
  practiceHistory: PracticeHistoryVLatest
}
type LoadPracticeHistoryConflict = {
  status: "conflict",
  localPracticeHistory: PracticeHistoryVLatest,
  remotePracticeHistory: PracticeHistoryVLatest
}
export type LoadPracticeHistoryResult =  LoadPracticeHistoryNew | LoadPracticeHistoryLoaded | LoadPracticeHistoryConflict

export const loadPracticeHistory = async (user: User): Promise<LoadPracticeHistoryResult> => {
  const loadFromLocalResult = loadPracticeHistoryFromLocalStorage(user)
  const retrievePracticeHistoryResult = await retrievePracticeHistory(user)
  if (retrievePracticeHistoryResult.status === "failure" ) {
    if (loadFromLocalResult.status === "failure") {
      console.log("a new practice history was created.")
      return {
        status: "new",
        practiceHistory: createBlankHistory()
      } as LoadPracticeHistoryNew
    } else {
      console.log("practice history was loaded from your browser.")
      return {
        status: "loaded",
        practiceHistory: loadFromLocalResult.practiceHistory
      } as LoadPracticeHistoryLoaded
    }
  } else {
    if (loadFromLocalResult.status === "failure"){
      console.log("practice history was loaded from the server.")
      return {
        status: "loaded",
        practiceHistory: retrievePracticeHistoryResult.practiceHistory
      } as LoadPracticeHistoryLoaded
    } else {
      console.log("there are two practice histories.")
      const arbitrate = (localHistory: PracticeHistoryVLatest, remoteHistory: PracticeHistoryVLatest) => {
        console.log(localHistory.hash, remoteHistory.hash)
        if (localHistory.hash === remoteHistory.hash) return localHistory
        return null
      }
      const arbitrationResult = arbitrate(loadFromLocalResult.practiceHistory, retrievePracticeHistoryResult.practiceHistory)
      if (arbitrationResult !== null) {
        return {
          status: "loaded",
          practiceHistory: arbitrationResult
        }
      }
      return {
        status: "conflict",
        localPracticeHistory: loadFromLocalResult.practiceHistory,
        remotePracticeHistory: retrievePracticeHistoryResult.practiceHistory
      } as LoadPracticeHistoryConflict
    }
  }
};

export const savePracticeHistory = (practiceHistory: PracticeHistoryVLatest, user: User) => {
  practiceHistory.hash = uuid.v4()
  savePracticeHistoryLocally(practiceHistory)
  if (user.status === "Authenticated") {
    savePracticeHistoryRemotely(practiceHistory, user)
  }
};


export const updatePracticeHistoryVersionFromV0toV1 = (oldPracticeHistory: PracticeHistoryV0): PracticeHistoryV1 => {
   return Object.assign({hash: uuid.v4()}, oldPracticeHistory, {version: "1.0" as const})
}
export const updatePracticeHistoryVersionFromV1toV2 = (oldPracticeHistory: PracticeHistoryV1): PracticeHistoryV2 => {
  const newWordsHistory: {[key: string]: WordHistoryV3} = {}
  for (const [wordUUID, wordHistory] of Object.entries(oldPracticeHistory.wordsHistory)) {
    newWordsHistory[wordUUID] = [wordHistory.nextPracticeDate, wordHistory.nPractices, wordHistory.strength]
  }
  return Object.assign(oldPracticeHistory, {wordsHistory: newWordsHistory, version: "2.0" as const})
}

export const updatePracticeHistoryVersion = (practiceHistory: PracticeHistory): PracticeHistoryVLatest => {
  switch(practiceHistory.version) {
    case "2.0":
      return practiceHistory
    case "1.0":
      return updatePracticeHistoryVersionFromV1toV2(practiceHistory)
    default:
      return updatePracticeHistoryVersionFromV1toV2(
        updatePracticeHistoryVersionFromV0toV1(practiceHistory)
      )
  }
}