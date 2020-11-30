import React from "react"
import {WordType} from "../../data/Word/Word"
import {DisplayWordWithFurigana} from "../../data/Word/DisplayWordWithFurigana";
import {Box, Typography} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import {useStyles} from "./Styles";
import {getColors} from "../../WordsView/Styles";

type FinalProps = {
  word: WordType,
  userInput: string,
  onNext: () => void,
}

export const Final: React.FC<FinalProps> = props => {
  const styles = useStyles();
  const {main, backGround} = getColors("CORRECT")
  const onKeyboardEvent2 = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      props.onNext()
    }
  }
  return <div style={{textAlign: "center", width:"100%"}}>
    <Box mt={4}>
      <Typography variant={"h4"}>{props.word.meaning}</Typography>
    </Box>
    <Box mt={4} style={{minHeight: 50}}>
      <Typography variant={"h5"}><DisplayWordWithFurigana word={props.word} /></Typography>
    </Box>
    <Box mt={4}>
      <div className={styles.answerInputBox} style={{backgroundColor: backGround, borderColor: main}} key={`${props.word.meaning}`}>
        <input
          className={styles.answerInput} value={props.userInput} readOnly={true}
          autoFocus={true} onKeyPress={onKeyboardEvent2}
          key={props.word.meaning}
        />
        <CheckIcon className={styles.answerInputIcon} />
      </div>
    </Box>
  </div>
}