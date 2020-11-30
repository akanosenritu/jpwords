import React from "react";
import {DisplayWordWithFurigana, WordType} from "../../data/Word";
import {Box, Typography} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import {useStyles} from "./Styles";
import {PracticeInput} from "./PracticeInput";
import {getColors} from "../../WordsView/Styles";

type TryProps = {
  word: WordType,
  onCorrectAnswer: (userInput: string) => void,
  onWrongAnswer: (userInput: string) => void,
  isHardMode: boolean,
  isSecond: boolean
}

export const Try: React.FC<TryProps> = props => {
  const styles = useStyles();
  const {main, backGround} = getColors("WRONG")
  return <div style={{textAlign: "center", width:"100%"}}>
    <Box mt={4}>
      <Typography variant={"h4"}>{props.word.meaning}</Typography>
    </Box>
    <Box mt={4} style={{minHeight: 50}}>
      {props.isSecond && <Typography variant={"h5"}><DisplayWordWithFurigana word={props.word} /></Typography>}
    </Box>
    <Box mt={4}>
      <div
        className={styles.answerInputBox} key={`${props.word.meaning}`}
        style={{backgroundColor: props.isSecond? backGround: "", borderColor: props.isSecond? main: ""}}
      >
        <PracticeInput word={props.word} isHardMode={props.isHardMode} onCorrectAnswer={props.onCorrectAnswer} onWrongAnswer={props.onWrongAnswer} />
      </div>
    </Box>
  </div>
}