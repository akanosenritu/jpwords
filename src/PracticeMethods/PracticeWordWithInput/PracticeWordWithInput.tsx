import React, {ChangeEvent,  useState, useMemo} from "react";
import {DisplayWordWithFurigana, evaluateAnswer, WordType} from "../../data/Word";
import {Box, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import CheckIcon from '@material-ui/icons/Check';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import * as wanakana from "wanakana";
import {getColors} from "../../WordsView/Styles";
import {initialConfigurations, useConfigurations} from "../../data/Storage/Configurations";
import {Try} from "./Try";
import {Final} from "./Final";

const useStyles = makeStyles({
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
    height: 56,
    padding: "4px 16px"
  },
  answerInputIcon: {
    padding: "5px 5px",
    color: "green"
  }
});

type PracticeWithInputProps = {
  word: WordType,
  onNext: (wasCorrect: boolean) => void,
}

type PracticeWithInputStatusType = "FIRST" | "SECOND" | "SUCCESS" | "FAIL"

export const PracticeWordWithInput: React.FC<PracticeWithInputProps> = (props) => {
  const {configurations} = useConfigurations(initialConfigurations);
  const [didAnswerWrongly, setDidAnswerWrongly] = useState(false);
  const [status, setStatus] = useState<PracticeWithInputStatusType>("FIRST")
  const [userInput, setUserInput] = useState("")
  return <>
    {status === "FIRST" &&
      <Try
        word={props.word}
        onCorrectAnswer={(userInput) => {
          setUserInput(userInput)
          setStatus("SUCCESS")
        }}
        onWrongAnswer={(userInput) => {
          setUserInput(userInput)
          setStatus("SECOND")
        }}
        isHardMode={configurations.hardMode}
        isSecond={false}
      />
    }
    {status === "SECOND" &&
    <Try
      word={props.word}
      onCorrectAnswer={(userInput) => {
        setUserInput(userInput)
        setStatus("FAIL")
      }}
      onWrongAnswer={(userInput) => {
        props.onNext(false)
      }}
      isHardMode={configurations.hardMode}
      isSecond={true}
    />
    }
    {status === "SUCCESS" &&
      <Final
        word={props.word}
        userInput={userInput}
        onNext={()=>props.onNext(true)}
      />
    }
    {status === "FAIL" &&
      <Final
        word={props.word}
        userInput={userInput}
        onNext={()=>props.onNext(false)}
      />
    }
  </>
}