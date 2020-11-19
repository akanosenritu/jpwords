import React, {useContext, useState} from "react";
import {PracticeWordListViewDoPractice} from "./PracticeWordListViewDoPractice";
import {PracticeWordListViewResult} from "./PracticeWordListViewResult";
import {PracticeWordListViewOverview} from "./PracticeWordListViewOverview";
import {availableWordLists, WordList} from "../../data/WordList";
import {TrainerResult} from "./Trainer/TrainerResult";
import {loadPracticeHistory, savePracticeHistory, updatePracticeHistory} from "../../data/Storage/PracticeHistory";
import {DebugContext} from "../Contexts";
import {availableWords} from "../../data/Word";

type PracticeWordListViewState = "start" | "practice" | "end"

export const PracticeWordListView: React.FC = () => {
  const [currentState, setCurrentState] = useState<PracticeWordListViewState>("start");
  const [wordListToPractice, setWordListToPractice] = useState<WordList>(availableWordLists[0]);
  const [practiceHistory] = useState(loadPracticeHistory());
  const startPractice = (wordList: WordList) => {
    setWordListToPractice(wordList);
    setCurrentState("practice");
  };
  const saveProgress = (practiceResult: TrainerResult) => {
    savePracticeHistory(updatePracticeHistory(practiceHistory, practiceResult.wordsDone.map(word => word.uuid), practiceResult.practiceQualities))
  };
  const [practiceResult, setPracticeResult] = useState<TrainerResult|null>(null);
  const finishPractice = (practiceResult: TrainerResult) => {
    saveProgress(practiceResult);
    setPracticeResult(practiceResult);
    setCurrentState("end");
  };
  const continuePractice = () => {
    setCurrentState("practice");
  };
  const isDebugging = useContext(DebugContext);
  if (isDebugging) {
    console.log("showing wordsHistory");
    for (let wordId in practiceHistory.wordsHistory) {
      const word = availableWords[wordId];
      console.log(word, practiceHistory.wordsHistory[wordId]);
    }
  }
  return <div>
    {currentState === "start" && <PracticeWordListViewOverview startPractice={startPractice}/>}
    {currentState === "practice" && <PracticeWordListViewDoPractice wordListToPractice={wordListToPractice} finishPractice={finishPractice}/>}
    {currentState === "end" && practiceResult && <PracticeWordListViewResult practiceResult={practiceResult} wordList={wordListToPractice} continuePractice={continuePractice}/>}
  </div>
};