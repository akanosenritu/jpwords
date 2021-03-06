import React, {useContext} from "react";
import {WordType} from "../../data/Word/Word";
import {Trainer2} from "./Trainer/Trainer";
import {WordListLoaded} from "../../data/WordLists/WordList";
import {TrainerResult} from "./Trainer/TrainerResult";
import {shuffle} from "lodash";
import {PracticeHistoryContext} from "../../data/PracticeHistory/PracticeHistoryProvider";
import {chooseWordsToPractice} from "../../data/PracticeHistory/PracticeHistoryUtils";

type PracticeWordListViewDoPracticeProps = {
    wordListToPractice: WordListLoaded,
    finishPractice: (practiceResult: TrainerResult) => void;
}

export const PracticeWordListViewDoPractice: React.FC<PracticeWordListViewDoPracticeProps> = (props) => {
  const {practiceHistory} = useContext(PracticeHistoryContext)
  const words = shuffle(chooseWordsToPractice(props.wordListToPractice, practiceHistory, 20));
  const finishPractice = (wordsDone: WordType[], practiceQualities: number[]) => {
    const practiceResult = {
      wordList: props.wordListToPractice,
      wordsDone: wordsDone,
      practiceQualities: practiceQualities
    };
    props.finishPractice(practiceResult);
  };
  return <Trainer2 words={words} reversed={false} finishPractice={finishPractice}/>
};