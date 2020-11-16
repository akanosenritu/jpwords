import React, {useState} from "react";
import {Box, Button, makeStyles, Typography} from "@material-ui/core";
import {DisplayWordWithFurigana, Word} from "../data/Word";
import {CorrectOption, CorrectOptionReversed, WrongOption, WrongOptionReversed} from "../WordsView/Practice/Option";


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
}));

type PracticeWithSelectionChildProps = {
  word: Word,
  optionWords: Word[],
  onNext: (wasCorrect: boolean) => void,
  position: number,
  onClickCorrectOption: () => void,
  onClickWrongOption: () => void,
  isAnswered: boolean,
  didAnswerCorrectly: boolean
}

// JtE stands for "Japanese to English"
const PracticeWithSelectionJtE: React.FC<PracticeWithSelectionChildProps> = (props) => {
  const word = props.word;
  const correctOption = <CorrectOption word={props.word} isCorrect={true} onAnswered={props.onClickCorrectOption} isAnswered={props.isAnswered} />;
  let options = props.optionWords.map(option => {
    return <WrongOption word={option} isCorrect={false} onAnswered={props.onClickWrongOption} isAnswered={props.isAnswered}/>
  });
  options.splice(props.position, 0, correctOption);
  const onNextWrong = () => {
    props.onNext(false);
  };
  const classes = useStyles();
  return <div style={{textAlign: "center"}}>
    <Box mt={2}>
      <Typography variant={"h3"}><DisplayWordWithFurigana word={word} /></Typography>
    </Box>
    {/*
    <Box mt={2}>
      <Typography variant={"h4"}>{word.kana}</Typography>
    </Box>
    */}
    <Box className={classes.root} mt={4}>
      {options}
    </Box>
    <Box mt={2}>
      {!props.didAnswerCorrectly && props.isAnswered && <Button variant={"contained"} color={"primary"} onClick={onNextWrong} fullWidth>Next</Button> }
    </Box>
  </div>
};

// EtJ stands for "English to Japanese"
const PracticeWithSelectionEtJ: React.FC<PracticeWithSelectionChildProps> = (props) => {
  const word = props.word;
  const correctOption = <CorrectOptionReversed word={props.word} isCorrect={true} onAnswered={props.onClickCorrectOption} isAnswered={props.isAnswered} />;
  let options = props.optionWords.map(option => {
    return <WrongOptionReversed word={option} isCorrect={false} onAnswered={props.onClickWrongOption} isAnswered={props.isAnswered}/>
  });
  options.splice(props.position, 0, correctOption);
  const onNextWrong = () => {
    props.onNext(false);
  };
  const classes = useStyles();
  return <div style={{textAlign: "center"}}>
    <Box mt={2}>
      <Typography variant={"h3"}>{word.meaning}</Typography>
    </Box>
    <Box className={classes.root} mt={4}>
      {options}
    </Box>
    <Box mt={2}>
      {!props.didAnswerCorrectly && props.isAnswered && <Button variant={"contained"} color={"primary"} onClick={onNextWrong} fullWidth>Next</Button> }
    </Box>
  </div>
};

type PracticeWordsWithSelectionProps = PracticeWithSelectionChildProps & {
  type: "JtE" | "EtJ"
}

export const PracticeWordWithSelection: React.FC<PracticeWordsWithSelectionProps> = props => {
  const [isAnswered, setIsAnswered] = useState(false);
  const [didAnswerCorrectly, setDidAnswerCorrectly] = useState(false);
  const onClickCorrectOption = () => {
    if (isAnswered) {
      setDidAnswerCorrectly(false);
      setTimeout(props.onNext, 1000, false);
    } else {
      setIsAnswered(true);
      setDidAnswerCorrectly(true);
      setTimeout(props.onNext, 1000, true);
    }

  };
  const onClickWrongOption = () => {
    setIsAnswered(true);
  };
  return props.type === "JtE" ?
    <PracticeWithSelectionJtE word={props.word} optionWords={props.optionWords} onNext={props.onNext}
                                   position={props.position} onClickCorrectOption={onClickCorrectOption}
                                   onClickWrongOption={onClickWrongOption} didAnswerCorrectly={didAnswerCorrectly}
                                   isAnswered={isAnswered}
    /> :
    <PracticeWithSelectionEtJ word={props.word} optionWords={props.optionWords} onNext={props.onNext}
                                   position={props.position} onClickCorrectOption={onClickCorrectOption}
                                   onClickWrongOption={onClickWrongOption} didAnswerCorrectly={didAnswerCorrectly}
                                   isAnswered={isAnswered}
    />
};