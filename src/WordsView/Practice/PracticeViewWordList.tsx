import React from "react";
import {useHistory, useLocation, useRouteMatch} from "react-router-dom";
import {Box, Button, Typography} from "@material-ui/core";
import {Word} from "../../data/Word";
import {WordList} from "../../data/WordList";
import {usePracticeViewStyles} from "./PracticeViewStyle";
import {createBlankHistory, PracticeHistory} from "../../data/PracticeHistory";

type PracticeViewWordListLocationState = {
  wordListToPractice: WordList
}

const loadPracticeHistory: (wordList: WordList) => PracticeHistory = (wordList) => {
  const localStorage = window.localStorage;
  const history = localStorage.getItem(wordList.name + "-practiceHistory");
  if (history) return JSON.parse(history) as PracticeHistory;
  else return createBlankHistory();
}

export const PracticeViewWordList: React.FC = () => {
  const location = useLocation<PracticeViewWordListLocationState>();
  const practiceHistory = loadPracticeHistory(location.state.wordListToPractice);
  return <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} position={"center"}>
    <Typography variant={"h5"}>Welcome</Typography>
    {practiceHistory.lastPracticeDate.toDateString()}
  </Box>
}