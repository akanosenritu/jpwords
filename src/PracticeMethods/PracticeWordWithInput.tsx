import React, {ChangeEvent,  useState, useMemo} from "react";
import {DisplayWordWithFurigana, isPossibleToMakeVerbWithSuru, WordType} from "../data/Word";
import {Box, Typography} from "@material-ui/core";
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

type PracticeWithInputStatusType = "CORRECT" | "WRONG" | ""

export const PracticeWordWithInput: React.FC<PracticeWithInputProps> = (props) => {
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<PracticeWithInputStatusType>("");
  const [didAnswerWrongly, setDidAnswerWrongly] = useState(false);
  const styles = useStyles();
  const [isComposing, setIsComposing] = useState(false);
  const isKatakana = useMemo(() => wanakana.isKatakana(props.word.kana), [props.word.kana]);
  const onChangeEvent = (event: ChangeEvent<HTMLInputElement>) => {
    const newAnswer = isKatakana? wanakana.toKatakana(event.currentTarget.value, {IMEMode: true}): wanakana.toHiragana(event.currentTarget.value, {IMEMode: true});
    if (isAnswerCorrect(newAnswer) && !isComposing) {
      onCorrectlyAnswered();
    }
    if (status !== "CORRECT") {
      setAnswer(newAnswer);
    }
  }
  const onKeyboardEvent2 = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      event.preventDefault();
      if (status === "WRONG") {
        onNext(false)
      } else if (status === "CORRECT") {
        onNext(!didAnswerWrongly)
      } else {
        if (isAnswerCorrect(answer)) {
          onCorrectlyAnswered()
        } else {
          onWronglyAnswered();
        }
      }
    }
  }
  const isAnswerCorrect = (answer: string): boolean => {
    if (props.word.kana) {
      if (props.word.kana.replace("～", "") === answer) {
        return true
      }
      if (props.word.kana === answer) {
        return true
      }
    }
    if (props.word.kanji) {
      if (props.word.kanji.replace("～", "") === answer) {
        return true
      }
      if (props.word.kanji === answer) {
        return true
      }
    }
    return false
  }
  const onCompositionEnd = () => {
    setIsComposing(false);
    if (isAnswerCorrect(answer)) {
      onCorrectlyAnswered();
    }
  }
  const onCorrectlyAnswered = () => {
    setStatus("CORRECT");
  }
  const onWronglyAnswered = () => {
    setDidAnswerWrongly(true);
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
    <Box mt={4} style={{minHeight: 50}}>
      {status !== "" && <Typography variant={"h5"}><DisplayWordWithFurigana word={props.word} /></Typography>}
    </Box>
    <Box mt={4}>
      <div className={styles.answerInputBox} style={{backgroundColor: getBackGroundColor(), borderColor: getBorderColor()}} key={props.word.meaning}>
        <input
          className={styles.answerInput} value={answer} onChange={onChangeEvent} placeholder={`translate ${props.word.meaning}`}
          autoFocus={true} onKeyPress={onKeyboardEvent2}
          onCompositionStart={()=>setIsComposing(true)} onCompositionEnd={onCompositionEnd}
          key={props.word.meaning}
        />
        {status === "CORRECT" && <CheckIcon className={styles.answerInputIcon} />}
        {status === "WRONG" && <ErrorOutlineIcon className={styles.answerInputIcon} style={{color: getBorderColor()}} />}
      </div>
    </Box>
    <Box>
      {isPossibleToMakeVerbWithSuru(props.word) && <p>* this word can be made into a verb with -する.</p>}
    </Box>
  </div>
}