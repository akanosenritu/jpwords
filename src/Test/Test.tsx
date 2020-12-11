import React from "react";
import {Arbitrator} from "../data/PracticeHistory/Arbitrator";
import {PracticeHistory, PracticeHistoryV1} from "../data/PracticeHistory/PracticeHistory";

export const Test: React.FC = () => {
  const practiceHistory: PracticeHistoryV1 = {
    version: "1.0",
    wordsHistory: {},
    lastPracticeDate: new Date().toISOString(),
    hash: "test"
  }
  const onArbitrated = (practiceHistory: PracticeHistory) => {
    console.log(practiceHistory)
  }
  return <Arbitrator localHistory={practiceHistory} remoteHistory={practiceHistory} onArbitrated={onArbitrated} />
}
