import React, {useState} from "react";
import {WordType} from "../../data/Word/Word";
import {initialConfigurations, useConfigurations} from "../../data/Storage/Configurations";
import {Try} from "./Try";
import {Final} from "./Final";

type PracticeWithInputProps = {
  word: WordType,
  onNext: (wasCorrect: boolean) => void,
}

type PracticeWithInputStatusType = "FIRST" | "SECOND" | "SUCCESS" | "FAIL"

export const PracticeWordWithInput: React.FC<PracticeWithInputProps> = (props) => {
  const {configurations} = useConfigurations(initialConfigurations);
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