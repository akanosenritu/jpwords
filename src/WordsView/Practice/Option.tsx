import React from "react";
import {Typography, Button} from "@material-ui/core";
import {DisplayWordWithFurigana, Word} from "../../data/Word";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
  correctButtonBox: {
    borderRadius: "10px / 10px"
  },
  correctOptionBoxAnswered: {
    backgroundColor: "rgb(144, 238, 144, 50%)"
  }
})

type OptionProps = {
  word: Word,
  isCorrect: boolean,
  onAnswered: () => void,
  isAnswered: boolean
}

// given a Japanese word, select the correct meaning.
export const CorrectOption: React.FC<OptionProps> = (props) => {
  const classes = useStyles();
  const className = props.isAnswered? classes.correctOptionBoxAnswered: undefined;
  return <div className={className + " " + classes.correctButtonBox}>
    <Button onClick={props.onAnswered} style={{textTransform: "none"}}>
      <Typography variant={"h6"}>{props.word.meaning}
        {props.isAnswered &&  " ○"}
      </Typography>
    </Button>
  </div>
};

export const WrongOption: React.FC<OptionProps> = (props) => {
  return <div>
    <Button onClick={props.onAnswered} style={{textTransform: "none"}} disabled={props.isAnswered}>
      <Typography variant={"h6"}>{props.word.meaning}
        {props.isAnswered &&  " ×"}
      </Typography>
    </Button>
    {props.isAnswered && <Typography variant={"subtitle1"}><DisplayWordWithFurigana word={props.word} /></Typography>}
  </div>
};

// given a meaning, select the correct Japanese word.

export const CorrectOptionReversed: React.FC<OptionProps> = props => {
  // const displayed = props.word.kanji? `${props.word.kanji} (${props.word.kana})`: props.word.kana
  return <Button onClick={props.onAnswered} style={{textTransform: "none"}}>
    <Typography variant={"h6"}><DisplayWordWithFurigana word={props.word} /> {props.isAnswered &&  " ○"}</Typography>
  </Button>
};

export const WrongOptionReversed: React.FC<OptionProps> = props => {
  // const displayed = props.word.kanji? `${props.word.kanji} (${props.word.kana})`: props.word.kana
  return <div>
    <Button onClick={props.onAnswered} style={{textTransform: "none"}} disabled={props.isAnswered}>
      <Typography variant={"h6"}><DisplayWordWithFurigana word={props.word} /> {props.isAnswered &&  " ×"}</Typography>
    </Button>
    {props.isAnswered && <Typography variant={"subtitle1"}>{props.word.meaning}</Typography>}
  </div>
};