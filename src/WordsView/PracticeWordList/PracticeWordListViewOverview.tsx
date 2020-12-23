import React, {useContext} from "react";
import {Box, Button, Card, CardActions, CardContent, Typography} from "@material-ui/core";
import {WordList} from "../../data/WordLists/WordList";
import {usePracticeViewStyles} from "./PracticeViewStyle";
import {WordListsContext} from "../../data/WordLists/WordListsProvider";

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
  const {wordLists} = useContext(WordListsContext)
  return <Box mt={2} p={1}>
    <Box style={{borderLeft: "2px solid lightgray", paddingLeft: 10}}>
      <Typography variant={"h6"}>General Word Lists</Typography>
    </Box>
    <Box mt={2}>
      {wordLists.length > 0? wordLists.map(wordList => {
        return <StartPracticeByWordListCard wordList={wordList} onClickStart={props.startPractice} key={wordList.name} />
      }): "No available list."}
    </Box>
  </Box>
};

type PracticeWordListViewOverviewProps = {
  startPractice: (wordList: WordList) => void;
}

export const PracticeWordListViewOverview: React.FC<PracticeWordListViewOverviewProps> = (props) => {
  return <Box mt={2} p={1}>
    <StartPracticeByWordList startPractice={props.startPractice}/>
  </Box>
};