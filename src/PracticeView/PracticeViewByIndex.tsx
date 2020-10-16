import React from "react";
import {useParams} from "react-router-dom";
import {PracticeViewBase} from "./PracticeViewBase";
import {loadWordsByIndex, Word} from "../data/Word";
import {shuffle} from "lodash";
import {useLocation} from "react-router-dom";

type PracticeViewByIndexLocationState ={
  wordsToPractice: Word[]
}

export const PracticeViewByIndex: React.FC = () => {
  const location = useLocation<PracticeViewByIndexLocationState>();
  const words = location.state?.wordsToPractice;
  return <PracticeViewBase words={words}/>
};