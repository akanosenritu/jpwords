import React, {useState} from "react";
import {Box, Button, makeStyles, Typography} from "@material-ui/core";
import {Word} from "../data/Word";
import {CorrectOption, CorrectOptionReversed, WrongOption, WrongOptionReversed} from "./Option";


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

type MeaningSelectionProps = {
  word: Word,
  optionWords: Word[],
  onNext: (wasCorrect: boolean) => void,
  position: number
}

// JtE stands for "Japanese to English"
const PracticeWordsWithSelectionJtE: React.FC<MeaningSelectionProps> = (props) => {
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
  let options = props.optionWords.map(option => {
    return <WrongOption word={option} isCorrect={false} onAnswered={onWronglyAnswered} isAnswered={isAnswered}/>
  })
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
      {!didAnswerCorrectly && isAnswered && <Button variant={"contained"} color={"primary"} onClick={onNextWrong} fullWidth>Next</Button> }
    </Box>
  </div>
}

// EtJ stands for "English to Japanese"
const PracticeWordsWithSelectionEtJ: React.FC<MeaningSelectionProps> = (props) => {
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
  const correctOption = <CorrectOptionReversed word={props.word} isCorrect={true} onAnswered={onCorrectlyAnswered} isAnswered={isAnswered} />
  let options = props.optionWords.map(option => {
    return <WrongOptionReversed word={option} isCorrect={false} onAnswered={onWronglyAnswered} isAnswered={isAnswered}/>
  })
  options.splice(props.position, 0, correctOption);
  const onNextWrong = () => {
    props.onNext(false);
  }
  const classes = useStyles();
  return <div style={{textAlign: "center"}}>
    <Box mt={2}>
      <Typography variant={"h3"}>{word.meaning}</Typography>
    </Box>
    <Box className={classes.root} mt={4}>
      {options}
    </Box>
    <Box mt={2}>
      {!didAnswerCorrectly && isAnswered && <Button variant={"contained"} color={"primary"} onClick={onNextWrong} fullWidth>Next</Button> }
    </Box>
  </div>
}

type PracticeWordsWithSelectionProps = MeaningSelectionProps & {
  type: "JtE" | "EtJ"
}

export const PracticeWordsWithSelection: React.FC<PracticeWordsWithSelectionProps> = props => {
  return props.type === "JtE" ?
    <PracticeWordsWithSelectionJtE word={props.word} optionWords={props.optionWords} onNext={props.onNext}
                                   position={props.position}/> :
    <PracticeWordsWithSelectionEtJ word={props.word} optionWords={props.optionWords} onNext={props.onNext}
                                   position={props.position}/>
}