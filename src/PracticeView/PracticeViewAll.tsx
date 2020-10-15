import React from "react";
import {PracticeViewBase} from "./PracticeViewBase";
import {loadAllWords} from "../data/Word";


export const PracticeViewAll: React.FC = () => {
  const words = loadAllWords();
  return <PracticeViewBase words={words}/>
}