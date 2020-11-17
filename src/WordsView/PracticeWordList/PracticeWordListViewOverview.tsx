import React from "react";
import {Box, Button, Card, CardActions, CardContent, Typography} from "@material-ui/core";
import {availableWordLists, WordList} from "../../data/WordList";
import {usePracticeViewStyles} from "./PracticeViewStyle";

type StartPracticeByWordListCardProps = {
  wordList: WordList,
  onClickStart: (wordList: WordList) => void;
}

const StartPracticeByWordListCard: React.FC<StartPracticeByWordListCardProps> = (props) => {
  const classes = usePracticeViewStyles();
  const onClickStart = () => {
    props.onClickStart(props.wordList)
  };
  return <Card className={classes.startPracticeWordListCard} variant={"outlined"}>
    <CardContent>
      <Typography variant={"h6"}>{props.wordList.name} ({props.wordList.wordCount} words)</Typography>
      <Typography variant={"body1"}>{props.wordList.description}</Typography>
    </CardContent>
    <CardActions style={{justifyContent: "center"}}>
      <Button variant={"contained"} size={"small"} color={"primary"} onClick={onClickStart}>Start</Button>
    </CardActions>
  </Card>
};

type StartPracticeByWordListProps = {
  startPractice: (wordList: WordList) => void
}

const StartPracticeByWordList: React.FC<StartPracticeByWordListProps> = (props) => {
  const classes = usePracticeViewStyles();
  return <Box className={classes.startPractice} mt={2} mx={1} p={1}>
    <Typography variant={"h6"}>Word Lists</Typography>
    <Box mt={2} >
      {availableWordLists.map(wordList => {
        return <StartPracticeByWordListCard wordList={wordList} onClickStart={props.startPractice} key={wordList.name} />
      })}
    </Box>
  </Box>
};

type PracticeWordListViewOverviewProps = {
  startPractice: (wordList: WordList) => void;
}

export const PracticeWordListViewOverview: React.FC<PracticeWordListViewOverviewProps> = (props) => {
  const classes = usePracticeViewStyles();
  return <Box className={classes.startPractice} mx={1} mt={2} p={1}>
    <Typography variant={"h5"}>Welcome</Typography>
    <StartPracticeByWordList startPractice={props.startPractice}/>
  </Box>
};