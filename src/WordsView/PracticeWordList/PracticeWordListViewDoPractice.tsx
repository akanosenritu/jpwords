import React from "react";
import {WordTypeV2} from "../../data/Word";
import {Trainer2} from "./Trainer/Trainer";
import {WordList} from "../../data/WordList";
import {TrainerResult} from "./Trainer/TrainerResult";
import {chooseWordsToPractice, loadPracticeHistory} from "../../data/PracticeHistory";
import {shuffle} from "lodash";

type PracticeWordListViewDoPracticeProps = {
    wordListToPractice: WordList,
    finishPractice: (practiceResult: TrainerResult) => void;
}

export const PracticeWordListViewDoPractice: React.FC<PracticeWordListViewDoPracticeProps> = (props) => {
  const practiceHistory = loadPracticeHistory();
  const words = shuffle(chooseWordsToPractice(props.wordListToPractice, practiceHistory, 20));
  const finishPractice = (wordsDone: WordTypeV2[], practiceQualities: number[]) => {
    const practiceResult = {
      wordList: props.wordListToPractice,
      wordsDone: wordsDone,
      practiceQualities: practiceQualities
    };
    props.finishPractice(practiceResult);
  };
  return <Trainer2 words={words} reversed={false} finishPractice={finishPractice}/>
};