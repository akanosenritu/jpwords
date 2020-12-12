import React, {useContext, useState} from "react";
import {PracticeWordListViewDoPractice} from "./PracticeWordListViewDoPractice";
import {PracticeWordListViewResult} from "./PracticeWordListViewResult";
import {PracticeWordListViewOverview} from "./PracticeWordListViewOverview";
import {getAvailableWordLists, WordList} from "../../data/WordLists/WordList";
import {TrainerResult} from "./Trainer/TrainerResult";
import {initialConfigurations, useConfigurations} from "../../data/Storage/Configurations";
import {PracticeHistoryContext} from "../../data/PracticeHistory/PracticeHistoryProvider";
import {updatePracticeHistoryWithPracticeResult} from "../../data/PracticeHistory/PracticeHistoryUtils";
type PracticeWordListViewState = "start" | "practice" | "end"

export const PracticeWordListView: React.FC = () => {
  const {configurations} = useConfigurations(initialConfigurations);
  const [currentState, setCurrentState] = useState<PracticeWordListViewState>("start");
  const [wordListToPractice, setWordListToPractice] = useState<WordList|null>(
    getAvailableWordLists(configurations.language).length > 0?
      getAvailableWordLists(configurations.language)[0]:
      null
  );
  const {practiceHistory, updatePracticeHistory} = useContext(PracticeHistoryContext)
  const startPractice = (wordList: WordList) => {
    setWordListToPractice(wordList);
    setCurrentState("end");
  };
  const finishPractice = (practiceResult: TrainerResult) => {
    updatePracticeHistory(updatePracticeHistoryWithPracticeResult(practiceHistory, practiceResult.wordsDone.map(word => word.uuid), practiceResult.practiceQualities))
    setCurrentState("end");
  };
  const continuePractice = () => {
    setCurrentState("practice");
  };
  return <div style={{minWidth: 320, maxWidth: 500, margin: "auto", position:"relative"}}>
    {practiceHistory?
      <>
        {currentState === "start" && <PracticeWordListViewOverview startPractice={startPractice}/>}
        {currentState === "practice" && wordListToPractice && <PracticeWordListViewDoPractice wordListToPractice={wordListToPractice} finishPractice={finishPractice}/>}
        {currentState === "end" && wordListToPractice && <PracticeWordListViewResult wordList={wordListToPractice} continuePractice={continuePractice}/>}
      </>:
      <div>Loading...</div>
    }
  </div>
};