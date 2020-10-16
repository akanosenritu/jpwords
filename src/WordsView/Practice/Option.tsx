import React from "react";
import {Typography, Button} from "@material-ui/core";
import {Word} from "../../data/Word";

type OptionProps = {
  word: Word,
  isCorrect: boolean,
  onAnswered: () => void,
  isAnswered: boolean
}

// given a Japanese word, select the correct meaning.
export const CorrectOption: React.FC<OptionProps> = (props) => {
  return <Button onClick={props.onAnswered} style={{textTransform: "none"}}>
    <Typography variant={"h6"}>{props.word.meaning}
      {props.isAnswered &&  " ○"}
    </Typography>
  </Button>
};

export const WrongOption: React.FC<OptionProps> = (props) => {
  return <div>
    <Button onClick={props.onAnswered} style={{textTransform: "none"}} disabled={props.isAnswered}>
      <Typography variant={"h6"}>{props.word.meaning}
        {props.isAnswered &&  " ×"}
      </Typography>
    </Button>
    {props.isAnswered && <Typography variant={"subtitle1"}>{props.word.kanji} ({props.word.kana})</Typography>}
  </div>
}

// given a meaning, select the correct Japanese word.

export const CorrectOptionReversed: React.FC<OptionProps> = props => {
  const displayed = props.word.kanji? `${props.word.kanji} (${props.word.kana})`: props.word.kana
  return <Button onClick={props.onAnswered} style={{textTransform: "none"}}>
    <Typography variant={"h6"}>{displayed} {props.isAnswered &&  " ○"}</Typography>
  </Button>
}

export const WrongOptionReversed: React.FC<OptionProps> = props => {
  const displayed = props.word.kanji? `${props.word.kanji} (${props.word.kana})`: props.word.kana
  return <div>
    <Button onClick={props.onAnswered} style={{textTransform: "none"}} disabled={props.isAnswered}>
      <Typography variant={"h6"}>{displayed} {props.isAnswered &&  " ×"}</Typography>
    </Button>
    {props.isAnswered && <Typography variant={"subtitle1"}>{props.word.kanji} ({props.word.kana})</Typography>}
  </div>
}