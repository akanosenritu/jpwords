import React, {useContext, useEffect, useState} from "react";
import {PracticeWordListViewDoPractice} from "./PracticeWordListViewDoPractice";
import {PracticeWordListViewResult} from "./PracticeWordListViewResult";
import {PracticeWordListViewOverview} from "./PracticeWordListViewOverview";
import {getAvailableWordLists, WordList} from "../../data/WordLists/WordList";
import {TrainerResult} from "./Trainer/TrainerResult";
import {initialConfigurations, useConfigurations} from "../../data/Storage/Configurations";
import {
  loadPracticeHistory,
  PracticeHistory,
  savePracticeHistory,
  updatePracticeHistory
} from "../../data/PracticeHistory";
import {PracticeHistoryContext} from "../../General/Contexts";
import {UserContext} from "../../data/User";
type PracticeWordListViewState = "start" | "practice" | "end"

export const PracticeWordListView: React.FC = () => {
  const {configurations} = useConfigurations(initialConfigurations);
  const [currentState, setCurrentState] = useState<PracticeWordListViewState>("start");
  const {user} = useContext(UserContext)
  const [wordListToPractice, setWordListToPractice] = useState<WordList|null>(
    getAvailableWordLists(configurations.language).length > 0?
      getAvailableWordLists(configurations.language)[0]:
      null
  );
  const [practiceHistory, setPracticeHistory] = useState<PracticeHistory|null>(null)
  useEffect(() => {
    loadPracticeHistory(user)
      .then(practiceHistory => setPracticeHistory(practiceHistory))
  }, [user])
  const startPractice = (wordList: WordList) => {
    setWordListToPractice(wordList);
    setCurrentState("end");
  };
  const finishPractice = (practiceResult: TrainerResult) => {
    if (!practiceHistory) throw new Error("practice history is null for some reason.")
    savePracticeHistory(
      updatePracticeHistory(practiceHistory, practiceResult.wordsDone.map(word => word.uuid), practiceResult.practiceQualities),
      user
    )
    setCurrentState("end");
  };
  const continuePractice = () => {
    setCurrentState("practice");
  };
  return <div style={{maxWidth: 500, margin: "auto"}}>
    <PracticeHistoryContext.Provider value={practiceHistory}>
      {practiceHistory?
        <>
          {currentState === "start" && <PracticeWordListViewOverview startPractice={startPractice}/>}
          {currentState === "practice" && wordListToPractice && <PracticeWordListViewDoPractice wordListToPractice={wordListToPractice} finishPractice={finishPractice}/>}
          {currentState === "end" && wordListToPractice && <PracticeWordListViewResult wordList={wordListToPractice} continuePractice={continuePractice}/>}
        </>:
        <div>Loading...</div>
      }
    </PracticeHistoryContext.Provider>
  </div>
};