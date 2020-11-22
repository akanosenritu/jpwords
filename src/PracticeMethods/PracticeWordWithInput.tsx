import React, {ChangeEvent,  useState, useMemo} from "react";
import {DisplayWordWithFurigana, evaluateAnswer, isPossibleToMakeVerbWithSuru, WordType} from "../data/Word";
import {Box, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import CheckIcon from '@material-ui/icons/Check';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import * as wanakana from "wanakana";
import {getColors} from "../WordsView/Styles";

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

type PracticeWithInputStatusType = "CORRECT INPUT" | "SIMILAR INPUT" | "WRONG INPUT" | ""

export const PracticeWordWithInput: React.FC<PracticeWithInputProps> = (props) => {
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<PracticeWithInputStatusType>("");
  const [didAnswerWrongly, setDidAnswerWrongly] = useState(false);
  const styles = useStyles();
  const [isComposing, setIsComposing] = useState(false);
  const isKatakana = useMemo(() => wanakana.isKatakana(props.word.kana), [props.word.kana]);
  const onChangeEvent = (event: ChangeEvent<HTMLInputElement>) => {
    const newAnswer = isKatakana? wanakana.toKatakana(event.currentTarget.value, {IMEMode: true}): wanakana.toHiragana(event.currentTarget.value, {IMEMode: true});
    const evaluation = evaluateAnswer(props.word, newAnswer);
    if (evaluation === "CORRECT" && !isComposing) {
      onCorrectlyAnswered();
    }
    if (status !== "CORRECT INPUT") {
      setAnswer(newAnswer);
    }
  }
  const onKeyboardEvent2 = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      event.preventDefault();
      if (status === "WRONG INPUT" || status === "SIMILAR INPUT") {
        onNext(false)
      } else if (status === "CORRECT INPUT") {
        onNext(!didAnswerWrongly)
      } else {
        const evaluation = evaluateAnswer(props.word, answer);
        if (evaluation === "CORRECT") {
          onCorrectlyAnswered()
        } else if (evaluation === "CORRECT, BUT NOT WHAT I EXPECTED") {
          onSimilarlyAnswered();
        } else {
          onWronglyAnswered();
        }
      }
    }
  }
  const onCompositionEnd = () => {
    setIsComposing(false);
    const evaluation = evaluateAnswer(props.word, answer);
    if (evaluation === "CORRECT") {
      onCorrectlyAnswered();
    } else if (evaluation === "CORRECT, BUT NOT WHAT I EXPECTED") {
      onSimilarlyAnswered();
    }
  }
  const onCorrectlyAnswered = () => {
    setStatus("CORRECT INPUT");
  }
  const onSimilarlyAnswered = () => {
    setStatus("SIMILAR INPUT");
  }
  const onWronglyAnswered = () => {
    setDidAnswerWrongly(true);
    setStatus("WRONG INPUT");
  }
  const onNext = (wasCorrect: boolean) => {
    setAnswer("");
    setStatus("");
    props.onNext(wasCorrect);
  };
  const {backGround, main} = (() => {
    switch(status) {
      case "CORRECT INPUT":
        return getColors("CORRECT")
      case "SIMILAR INPUT":
        return getColors("COLOR A")
      case "WRONG INPUT":
        return getColors("WRONG")
      default:
        return getColors("")
    }
  })();
  return <div style={{textAlign: "center", width:"100%"}}>
    <Box mt={4}>
      <Typography variant={"h4"}>{props.word.meaning}</Typography>
    </Box>
    <Box mt={4} style={{minHeight: 50}}>
      {status !== "" && <Typography variant={"h5"}><DisplayWordWithFurigana word={props.word} /></Typography>}
    </Box>
    <Box mt={4}>
      <div className={styles.answerInputBox} style={{backgroundColor: backGround, borderColor: main}} key={`${props.word.meaning}-${status}`}>
        <input
          className={styles.answerInput} value={answer} onChange={onChangeEvent} placeholder={`translate ${props.word.meaning}`}
          autoFocus={true} onKeyPress={onKeyboardEvent2}
          onCompositionStart={()=>setIsComposing(true)} onCompositionEnd={onCompositionEnd}
          key={props.word.meaning}
        />
        {status === "CORRECT INPUT" && <CheckIcon className={styles.answerInputIcon} />}
        {status === "WRONG INPUT" && <ErrorOutlineIcon className={styles.answerInputIcon} style={{color: main}} />}
      </div>
    </Box>
    <Box>
      {isPossibleToMakeVerbWithSuru(props.word) && <p>* this word can be made into a verb with -する.</p>}
    </Box>
  </div>
}