import React, {useState} from "react";
import {PracticeWordListViewDoPractice} from "./PracticeWordListViewDoPractice";
import {PracticeWordListViewResult} from "./PracticeWordListViewResult";
import {PracticeWordListViewOverview} from "./PracticeWordListViewOverview";
import {availableWordLists, WordList} from "../../data/WordList";
import {TrainerResult} from "./Trainer/TrainerResult";
import {loadPracticeHistory, savePracticeHistory, updatePracticeHistory} from "../../data/PracticeHistory";

type PracticeWordListViewState = "start" | "practice" | "end"

export const PracticeWordListView: React.FC = () => {
  const [currentState, setCurrentState] = useState("start");
  const [wordListToPractice, setWordListToPractice] = useState<WordList>(availableWordLists[0]);
  const [practiceHistory, setPracticeHistory] = useState(loadPracticeHistory(availableWordLists[0]));
  const startPractice = (wordList: WordList) => {
    setWordListToPractice(wordList);
    setCurrentState("practice");
  };
  const saveProgress = (practiceResult: TrainerResult) => {
    savePracticeHistory(wordListToPractice, updatePracticeHistory(practiceHistory, practiceResult.wordsDone))
  };
  const [practiceResult, setPracticeResult] = useState();
  const finishPractice = (practiceResult: TrainerResult) => {
    saveProgress(practiceResult);
    setPracticeResult(practiceResult);
    setCurrentState("end");
  };
  const continuePractice = () => {
    setCurrentState("practice");
  };
  return <div>
      {currentState === "start" && <PracticeWordListViewOverview startPractice={startPractice}/>}
      {currentState === "practice" && <PracticeWordListViewDoPractice wordListToPractice={wordListToPractice} finishPractice={finishPractice}/>}
      {currentState === "end" && <PracticeWordListViewResult practiceResult={practiceResult} wordList={wordListToPractice} continuePractice={continuePractice}/>}
  </div>
};