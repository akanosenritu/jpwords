import React, {useState} from "react";
import {PracticeWordListViewDoPractice} from "./PracticeWordListViewDoPractice";
import {PracticeWordListViewResult} from "./PracticeWordListViewResult";
import {PracticeWordListViewOverview} from "./PracticeWordListViewOverview";
import {getAvailableWordLists, WordList} from "../../data/WordLists/WordList";
import {TrainerResult} from "./Trainer/TrainerResult";
import {loadPracticeHistory, savePracticeHistory, updatePracticeHistory} from "../../data/Storage/PracticeHistory";
import {ConfigurationsEntry} from "../../General/ConfigurationsScreen";
import {initialConfigurations, useConfigurations} from "../../data/Storage/Configurations";

type PracticeWordListViewState = "start" | "practice" | "end"

export const PracticeWordListView: React.FC = () => {
  const {configurations} = useConfigurations(initialConfigurations);
  const [currentState, setCurrentState] = useState<PracticeWordListViewState>("start");
  const [wordListToPractice, setWordListToPractice] = useState<WordList|null>(
    getAvailableWordLists(configurations.language).length > 0?
      getAvailableWordLists(configurations.language)[0]:
      null
  );
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
    {currentState === "practice" && wordListToPractice && <PracticeWordListViewDoPractice wordListToPractice={wordListToPractice} finishPractice={finishPractice}/>}
    {currentState === "end" && wordListToPractice && <PracticeWordListViewResult wordList={wordListToPractice} continuePractice={continuePractice}/>}
  </div>
};