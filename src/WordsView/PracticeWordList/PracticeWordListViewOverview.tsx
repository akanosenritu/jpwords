import React, {useContext, useState} from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography";
import {WordList, WordListLoaded} from "../../data/WordLists/WordList";
import {usePracticeViewStyles} from "./PracticeViewStyle";
import {WordListsContext} from "../../data/WordLists/WordListsProvider";

type StartPracticeByWordListCardProps = {
  wordList: WordList,
  onClickStart: (wordList: WordListLoaded) => void;
}

const StartPracticeByWordListCard: React.FC<StartPracticeByWordListCardProps> = (props) => {
  const classes = usePracticeViewStyles();
  const {loadWords} = useContext(WordListsContext)

  const [wasStartButtonPushed, setWasStartButtonPushed] = useState(false)
  const onClickStart = async () => {
    setWasStartButtonPushed(true)
    if (props.wordList.status === "initial") {
      const result = await loadWords(props.wordList)
      if (result.status === "success") {
        props.onClickStart(result.data)
      }
    } else {
      props.onClickStart(props.wordList)
    }
  };
  return <Card className={classes.startPracticeWordListCard} variant={"outlined"}>
    <CardContent>
      <Typography variant={"h6"}>{props.wordList.name} ({props.wordList.wordCount} words)</Typography>
      <Typography variant={"body1"}>{props.wordList.description}</Typography>
    </CardContent>
    <CardActions style={{justifyContent: "center"}}>
      <Button variant={"contained"} size={"small"} color={"primary"} onClick={onClickStart} disabled={wasStartButtonPushed}>
        {wasStartButtonPushed? "Loading": "Start"}
      </Button>
    </CardActions>
  </Card>
};

type StartPracticeByWordListProps = {
  startPractice: (wordList: WordListLoaded) => void
}

const StartPracticeByWordList: React.FC<StartPracticeByWordListProps> = (props) => {
  const {wordLists} = useContext(WordListsContext)
  return <Box mt={2} p={1}>
    <Box style={{borderLeft: "2px solid lightgray", paddingLeft: 10}}>
      <Typography variant={"h6"}>General Word Lists</Typography>
    </Box>
    <Box mt={2}>
      {wordLists.length > 0? wordLists.map(wordList => {
        return <StartPracticeByWordListCard wordList={wordList} onClickStart={props.startPractice} key={`${wordList.uuid}-${wordList.status}`} />
      }): "No available list."}
    </Box>
  </Box>
};

type PracticeWordListViewOverviewProps = {
  startPractice: (wordList: WordListLoaded) => void;
}

export const PracticeWordListViewOverview: React.FC<PracticeWordListViewOverviewProps> = (props) => {
  return <Box mt={2} p={1}>
    <StartPracticeByWordList startPractice={props.startPractice}/>
  </Box>
};