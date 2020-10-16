import React, {useState, useEffect} from "react";
import {Box, Container, LinearProgress, Paper, Typography, makeStyles, IconButton, Button} from "@material-ui/core";
import {useSpring, animated} from "react-spring";
import {Word} from "../data/Word";
import {shuffle} from "lodash";
import {CorrectOption, WrongOption} from "./Option";


const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    "& > *": {
      margin: theme.spacing(1),
      width: "100%",
      textAlign: "center"
    }
  }
}))

type OptionProps = {
  meaning: string,
  isCorrect: boolean,
  onAnswered: (num: number) => void,
  isAnswered: boolean
  num: number
}

const Option: React.FC<OptionProps> = (props) => {
  const handleClick = () => {
    props.onAnswered(props.num)
  }
  return <Button onClick={handleClick} style={{textTransform: "none"}}>
    <Typography variant={"h6"}>{props.meaning}
      {props.isAnswered && props.isCorrect && " ○"}
      {props.isAnswered && !props.isCorrect && " ×"}
    </Typography>
  </Button>
}

type MeaningSelectionProps = {
  word: Word,
  optionWords: Word[],
  onNext: (wasCorrect: boolean) => void,
  position: number
}

export const PracticeWordsWithSelection: React.FC<MeaningSelectionProps> = (props) => {
  console.log(props.optionWords.length)
  const [isAnswered, setIsAnswered] = useState(false);
  const [didAnswerCorrectly, setDidAnswerCorrectly] = useState(false);
  const word = props.word;
  const onCorrectlyAnswered = () => {
    setIsAnswered(true);
    setDidAnswerCorrectly(true);
    setTimeout(props.onNext, 1000, [true]);
  };
  const onWronglyAnswered = () => {
    setIsAnswered(true);
  }
  const correctOption = <CorrectOption word={props.word} isCorrect={true} onAnswered={onCorrectlyAnswered} isAnswered={isAnswered} />
  const wrongOptions = props.optionWords.map(option => {
    return <WrongOption word={option} isCorrect={false} onAnswered={onWronglyAnswered} isAnswered={isAnswered} />
  })
  let options = wrongOptions
  options.splice(props.position, 0, correctOption);
  const onNextWrong = () => {
    props.onNext(false);
  }
  const classes = useStyles();
  return <div style={{textAlign: "center"}}>
    <Box mt={2}>
      <Typography variant={"h3"}>{word.kanji}</Typography>
    </Box>
    <Box mt={2}>
      <Typography variant={"h4"}>{word.kana}</Typography>
    </Box>
    <Box className={classes.root} mt={4}>
      {options}
    </Box>
    <Box mt={2}>
      {!didAnswerCorrectly && isAnswered && <Button variant={"contained"} color={"primary"} size={"small"} onClick={onNextWrong}>Next</Button> }
    </Box>
  </div>
}