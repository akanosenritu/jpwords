import React from "react";
import {PracticeViewBase} from "./PracticeViewBase";
import {Word} from "../../data/Word";
import {useLocation} from "react-router-dom";

type PracticeViewByIndexLocationState ={
  wordsToPractice: Word[]
}

export const PracticeViewByIndex: React.FC = () => {
  const location = useLocation<PracticeViewByIndexLocationState>();
  const words = location.state?.wordsToPractice;
  return <PracticeViewBase words={words} reversed={false}/>
};

export const PracticeViewByIndexWithReversedSelection: React.FC = () => {
  const location = useLocation<PracticeViewByIndexLocationState>();
  const words = location.state?.wordsToPractice;
  return <PracticeViewBase words={words} reversed={true}/>
};
