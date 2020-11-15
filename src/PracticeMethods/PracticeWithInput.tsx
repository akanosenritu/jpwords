import React, {ChangeEvent, useRef, useState, useMemo, useEffect} from "react";
import {DisplayWordWithFurigana, Word} from "../data/Word";
import {Box, Checkbox, FormControlLabel, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import CheckIcon from '@material-ui/icons/Check';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import * as wanakana from "wanakana";

const useStyles = makeStyles({
  answerInput: {
    width: "100%",
    height: 24,
    fontSize: 18,
    border: "none",
    outline: "none",
    boxSizing: "border-box",
    background: "none",
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
  word: Word,
  onNext: (wasCorrect: boolean) => void,
}

type PracticeWithInputStatusType = "CORRECT" | "WRONG" | ""

export const PracticeWithInput: React.FC<PracticeWithInputProps> = (props) => {
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<PracticeWithInputStatusType>("");
  const styles = useStyles();
  const [isComposing, setIsComposing] = useState(false);
  const isKatakana = useMemo(() => wanakana.isKatakana(props.word.kana), [props.word.kana]);
  const onChangeEvent = (event: ChangeEvent<HTMLInputElement>) => {
    const newAnswer = isKatakana? wanakana.toKatakana(event.currentTarget.value, {IMEMode: true}): wanakana.toHiragana(event.currentTarget.value, {IMEMode: true});
    if (isAnswerCorrect(newAnswer) && !isComposing) {
      onCorrectlyAnswered(status === "WRONG");
    }
    setAnswer(newAnswer);
  }
  const onKeyboardEvent = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      event.preventDefault();
      if (status === "WRONG") {
        onNext(false);
      } else if (!isAnswerCorrect(answer)) {
        onWronglyAnswered();
      } else {
        // @ts-ignore
        onCorrectlyAnswered(false);
      }
    }
  }
  const isAnswerCorrect = (answer: string): boolean => {
    if (props.word.kana) {
      if (props.word.kana.replace("～", "") === answer) {
        return true
      }
      return props.word.kana === answer
    } else if (props.word.kanji) {
      if (props.word.kanji.replace("～", "") === answer) {
        return true
      }
      return props.word.kanji === answer
    } else {
      return false
    }
  }
  const onCompositionEnd = () => {
    setIsComposing(false);
    if (isAnswerCorrect(answer)) {
      onCorrectlyAnswered(status === "WRONG");
    }
  }
  const onCorrectlyAnswered = (isSecondTry: boolean) => {
    setStatus("CORRECT");
    setTimeout(() => {
      onNext(!isSecondTry);
    }, 1000);
  }
  const onWronglyAnswered = () => {
    setStatus("WRONG");
  }
  const onNext = (wasCorrect: boolean) => {
    setAnswer("");
    setStatus("");
    props.onNext(wasCorrect);
  };
  const getBackGroundColor = () => {
    switch (status) {
      case "WRONG":
        return "#fffaf2"
      case "CORRECT":
        return "#e9fce9"
      case "":
        return ""
    }
  }
  const getBorderColor = () => {
    switch (status) {
      case "WRONG":
        return "#ffd899"
      case "CORRECT":
        return "#91ee91"
      case "":
        return ""
    }
  }
  return <div style={{textAlign: "center", width:"100%"}}>
    <Box mt={4}>
      <Typography variant={"h4"}>{props.word.meaning}</Typography>
    </Box>
    <Box>
      {status === "WRONG" && <Typography variant={"h5"}><DisplayWordWithFurigana word={props.word} /></Typography>}
    </Box>
    <Box mt={4}>
      <div className={styles.answerInputBox} style={{backgroundColor: getBackGroundColor(), borderColor: getBorderColor()}} key={props.word.meaning}>
        <input
          className={styles.answerInput} value={answer} onChange={onChangeEvent} placeholder={`translate ${props.word.meaning}`}
          autoFocus={true} onKeyPress={onKeyboardEvent}
          onCompositionStart={()=>setIsComposing(true)} onCompositionEnd={onCompositionEnd}
          key={props.word.meaning}
        />
        {status === "CORRECT" && <CheckIcon className={styles.answerInputIcon} />}
        {status === "WRONG" && <ErrorOutlineIcon className={styles.answerInputIcon} />}
      </div>
    </Box>
  </div>
}