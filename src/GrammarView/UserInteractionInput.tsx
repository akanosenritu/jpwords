import React, {useState} from "react";
import {UserInteractionProps} from "./UserInteractionContext";
import {Box} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import {PracticeInput} from "../PracticeMethods/PracticeWordWithInput/PracticeInput";
import * as wanakana from "wanakana";
import {getColors} from "../WordsView/Styles";

export const useStyles = makeStyles({
  answerInput: {
    width: "100%",
    height: 24,
    fontSize: 18,
    border: "none",
    outline: "none",
    boxSizing: "border-box",
    background: "none",
    padding: 0
  },
  answerInputBox: {
    width: "80%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    margin: "auto",
    border: "2px solid #ddd",
    borderRadius: 32,
    borderSizing: "border-box",
    height: 40,
    padding: "4px 16px"
  },
  answerInputIcon: {
    padding: "5px 5px",
    color: "green"
  }
});

export const UserInteractionInput: React.FC<UserInteractionProps> = props => {
  const classes = useStyles()
  const evaluate = (userInput: string) => userInput === props.answer
  const [didCorrectlyAnswer, setDidCorrectlyAnswer] = useState(false)
  const onCorrectlyAnswered = () => {
    setDidCorrectlyAnswer(true)
    props.onCorrectlyAnswered()
  }
  const {main, backGround} = didCorrectlyAnswer? getColors("CORRECT"): getColors("")
  return <Box className={classes.answerInputBox} style={{backgroundColor: backGround, borderColor: main}}>
    <PracticeInput
      isHardMode={false}
      previousUserInput={""}
      onCorrectAnswer={onCorrectlyAnswered}
      onWrongAnswer={props.onWronglyAnswered}
      evaluateAnswer={evaluate}
      isKatakana={wanakana.isKatakana(props.answer)}
      placeholder={`fill the blank`}
    />
    {didCorrectlyAnswer && <CheckIcon className={classes.answerInputIcon} />}
  </Box>
}