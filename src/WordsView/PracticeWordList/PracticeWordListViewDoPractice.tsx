import React from "react";
import {PracticeViewBase} from "../Practice/PracticeViewBase";
import {Word} from "../../data/Word";
import {TrainerBase} from "./Trainer/Trainer";
import {WordList} from "../../data/WordList";
import {TrainerResult} from "./Trainer/TrainerResult";
import {chooseWordsToPractice, loadPracticeHistory} from "../../data/PracticeHistory";

type PracticeWordListViewDoPracticeProps = {
    wordListToPractice: WordList,
    finishPractice: (practiceResult: TrainerResult) => void;
}

export const PracticeWordListViewDoPractice: React.FC<PracticeWordListViewDoPracticeProps> = (props) => {
  const practiceHistory = loadPracticeHistory(props.wordListToPractice);
  const words = chooseWordsToPractice(props.wordListToPractice, practiceHistory, 20);
  const finishPractice = (wordsCorrectlyAnswered: Word[], wordsWronglyAnswered: Word[]) => {
    const practiceResult = {
      wordList: props.wordListToPractice,
      correctAnswers: wordsCorrectlyAnswered,
      wrongAnswers: wordsWronglyAnswered
    };
    props.finishPractice(practiceResult);
  };
  return <TrainerBase words={words} reversed={false} finishPractice={finishPractice}/>
};