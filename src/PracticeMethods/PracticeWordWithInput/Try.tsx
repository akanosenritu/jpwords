import React from "react";
import {evaluateAnswer, WordType} from "../../data/Word/Word";
import {DisplayWordWithFurigana} from "../../General/Components/DisplayWordWithFurigana";
import {Box, Typography} from "@material-ui/core";
import {useStyles} from "./Styles";
import {PracticeInput} from "./PracticeInput";
import {getColors} from "../../WordsView/Styles";
import * as wanakana from "wanakana";
import {initialConfigurations, useConfigurations} from "../../LocalStorage/Configurations";

type TryProps = {
  word: WordType,
  previousUserInput: string,
  onCorrectAnswer: (userInput: string) => void,
  onWrongAnswer: (userInput: string) => void,
  isHardMode: boolean,
  isSecond: boolean
}

export const Try: React.FC<TryProps> = props => {
  const styles = useStyles();
  const {main, backGround} = getColors("WRONG")
  const evaluate = (userInput: string) => {
    const evaluation = evaluateAnswer(props.word, userInput, props.isHardMode);
    return evaluation === "CORRECT";
  }
  const {configurations} = useConfigurations(initialConfigurations)

  return <div style={{textAlign: "center", width:"100%"}}>
    <Box mt={4}>
      <Typography variant={"h4"}>{props.word.meaning[configurations.language]}</Typography>
    </Box>
    <Box mt={4} style={{minHeight: 50}}>
      {props.isSecond && <Typography variant={"h5"}><DisplayWordWithFurigana word={props.word} /></Typography>}
    </Box>
    <Box mt={4}>
      <div
        className={styles.answerInputBox} key={props.word.meaning[configurations.language]}
        style={{backgroundColor: props.isSecond? backGround: "", borderColor: props.isSecond? main: ""}}
      >
        <PracticeInput
          placeholder={`translate ${props.word.meaning[configurations.language]}`}
          evaluateAnswer={evaluate}
          isKatakana={wanakana.isKatakana(props.word.kana)}
          isHardMode={props.isHardMode}
          onCorrectAnswer={props.onCorrectAnswer}
          onWrongAnswer={props.onWrongAnswer}
          previousUserInput={props.previousUserInput}
        />
      </div>
    </Box>
  </div>
}