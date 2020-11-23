import React, {useState} from "react";
import {PracticeWordListViewDoPractice} from "./PracticeWordListViewDoPractice";
import {PracticeWordListViewResult} from "./PracticeWordListViewResult";
import {PracticeWordListViewOverview} from "./PracticeWordListViewOverview";
import {availableWordLists, WordList} from "../../data/WordList";
import {TrainerResult} from "./Trainer/TrainerResult";
import {loadPracticeHistory, savePracticeHistory, updatePracticeHistory} from "../../data/Storage/PracticeHistory";
import {ConfigurationsEntry} from "../../General/ConfigurationsScreen";

type PracticeWordListViewState = "start" | "practice" | "end"

export const PracticeWordListView: React.FC = () => {
  const [currentState, setCurrentState] = useState<PracticeWordListViewState>("start");
  const [wordListToPractice, setWordListToPractice] = useState<WordList>(availableWordLists[0]);
  const [practiceHistory] = useState(loadPracticeHistory());
  const startPractice = (wordList: WordList) => {
    setWordListToPractice(wordList);
    setCurrentState("end");
  };
  const saveProgress = (practiceResult: TrainerResult) => {
    savePracticeHistory(updatePracticeHistory(practiceHistory, practiceResult.wordsDone.map(word => word.uuid), practiceResult.practiceQualities))
  };
  const finishPractice = (practiceResult: TrainerResult) => {
    saveProgress(practiceResult);
    setCurrentState("end");
  };
  const continuePractice = () => {
    setCurrentState("practice");
  };
  return <div style={{minWidth: 320, maxWidth: 500, margin: "auto", position:"relative"}}>
    <ConfigurationsEntry />
    {currentState === "start" && <PracticeWordListViewOverview startPractice={startPractice}/>}
    {currentState === "practice" && <PracticeWordListViewDoPractice wordListToPractice={wordListToPractice} finishPractice={finishPractice}/>}
    {currentState === "end" && <PracticeWordListViewResult wordList={wordListToPractice} continuePractice={continuePractice}/>}
  </div>
};