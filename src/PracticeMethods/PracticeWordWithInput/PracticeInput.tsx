import React, {ChangeEvent, useState} from "react";
import {useStyles} from "./Styles";
import * as wanakana from "wanakana";
import {evaluateAnswer, WordType} from "../../data/Word/Word";

type PracticeInputProps = {
  isHardMode: boolean,
  previousUserInput: string,
  word: WordType,
  onCorrectAnswer: (userInput: string) => void,
  onWrongAnswer: (userInput: string) => void,
}

export const PracticeInput: React.FC<PracticeInputProps> = props => {
  const styles = useStyles()
  const [answer, setAnswer] = useState(props.previousUserInput);
  const [isComposing, setIsComposing] = useState(false);
  const onChangeEvent = (event: ChangeEvent<HTMLInputElement>) => {
    const convertAnswer = (answer: string, isKatakana: boolean) => {
      return isKatakana? wanakana.toKatakana(event.currentTarget.value, {IMEMode: true}): wanakana.toHiragana(event.currentTarget.value, {IMEMode: true})
    }
    const newAnswer = props.isHardMode? event.target.value: convertAnswer(event.target.value, wanakana.isKatakana(props.word.kana));
    const evaluation = evaluateAnswer(props.word, newAnswer, props.isHardMode);
    if (evaluation === "CORRECT" && !isComposing) {
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
    const evaluation = evaluateAnswer(props.word, answer, props.isHardMode);
    if (evaluation === "CORRECT") {
      props.onCorrectAnswer(answer)
    }
  }
  return <input
    className={styles.answerInput} value={answer} onChange={onChangeEvent} placeholder={`translate ${props.word.meaning}`}
    autoFocus={true} onKeyPress={onKeyboardEvent2}
    onCompositionStart={()=>setIsComposing(true)} onCompositionEnd={onCompositionEnd}
    key={props.word.meaning}
  />
}