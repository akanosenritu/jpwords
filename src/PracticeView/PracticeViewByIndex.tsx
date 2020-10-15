import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {PracticeViewBase} from "./PracticeViewBase";
import {loadWordsByIndex, useWords} from "../data/Word";

export const PracticeViewByIndex: React.FC = () => {
  const {start, end} = useParams();
  const words = loadWordsByIndex(parseInt(start)-1, parseInt(end));
  return <PracticeViewBase words={words}/>
}