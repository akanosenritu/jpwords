import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {PracticeViewBase} from "./PracticeViewBase";
import {loadWordsByIndex, useWords} from "../data/Word";
import {shuffle} from "lodash";

export const PracticeViewByIndex: React.FC = () => {
  const {start, end} = useParams();
  const words = loadWordsByIndex(parseInt(start), parseInt(end)+1);
  return <PracticeViewBase words={words}/>
};

export const PracticeViewByIndexRandom: React.FC = () => {
  const {start, end} = useParams();
  const words = shuffle(loadWordsByIndex(parseInt(start), parseInt(end)+1));
  return <PracticeViewBase words={words} />
}