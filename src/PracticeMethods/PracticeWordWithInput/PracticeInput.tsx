import React, {ChangeEvent, useState} from "react";
import {useStyles} from "./Styles";
import * as wanakana from "wanakana";

type PracticeInputProps = {
  isHardMode: boolean,
  previousUserInput: string,
  onCorrectAnswer: (userInput: string) => void,
  onWrongAnswer: (userInput: string) => void,
  evaluateAnswer: (userInput: string) => boolean,
  isKatakana: boolean,
  placeholder: string
}

export const PracticeInput: React.FC<PracticeInputProps> = props => {
  const styles = useStyles()
  const [answer, setAnswer] = useState(props.previousUserInput);
  const [isComposing, setIsComposing] = useState(false);
  const onChangeEvent = (event: ChangeEvent<HTMLInputElement>) => {
    const convertAnswer = (answer: string, isKatakana: boolean) => {
      return isKatakana? wanakana.toKatakana(event.currentTarget.value, {IMEMode: true}): wanakana.toHiragana(event.currentTarget.value, {IMEMode: true})
    }
    const newAnswer = props.isHardMode? event.target.value: convertAnswer(event.target.value, props.isKatakana);
    const evaluation = props.evaluateAnswer(newAnswer);
    if (evaluation && !isComposing) {
      props.onCorrectAnswer(newAnswer)
    }
    setAnswer(newAnswer);
  }
  const onKeyboardEvent2 = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      event.preventDefault();
      props.onWrongAnswer(answer)
    }
  }
  const onCompositionEnd = () => {
    setIsComposing(false);
    if (props.evaluateAnswer(answer)) {
      props.onCorrectAnswer(answer)
    }
  }
  return <input
    className={styles.answerInput} value={answer} onChange={onChangeEvent} placeholder={props.placeholder}
    autoFocus={true} onKeyPress={onKeyboardEvent2}
    onCompositionStart={()=>setIsComposing(true)} onCompositionEnd={onCompositionEnd}
    key={props.placeholder}
  />
}