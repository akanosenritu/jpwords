import React, {useState} from "react";
import {Box, Container, LinearProgress, Typography} from "@material-ui/core";
import {PracticeWordsWithSelection} from "./PracticeWordsWithSelection";
import {Word, getSimilarWords} from "../data/Word";

type PracticeViewBaseProps = {
  words: Word[]
}

export const PracticeViewBase: React.FC<PracticeViewBaseProps> = (props) => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState<Word[]>([]);
  const onNext = (wasCorrect: boolean) => {
    if (wasCorrect) {
      setCorrectAnswers(arr => arr.concat(props.words[currentPosition]))
    }
    setCurrentPosition(previous => {
      return previous + 1
    });

  }
  return <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
      <LinearProgress variant={"determinate"} style={{width: "100%"}} value={currentPosition * 100 / props.words.length}/>
      <Box className={"ShowProgress"} display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
        <Container>
          <Typography variant={"subtitle1"}>Correct</Typography>
          <Typography variant={"h6"}>{correctAnswers.length}</Typography>
        </Container>
        <Container>
          <Typography variant={"subtitle1"}>Incorrect</Typography>
          <Typography variant={"h6"}>{currentPosition - correctAnswers.length}</Typography>
        </Container>
        <Container>
          <Typography variant={"subtitle1"}>Total</Typography>
          <Typography variant={"h6"}>{currentPosition}/{props.words.length}</Typography>
        </Container>
      </Box>
      <Container className={"explanation"}>
        <Typography variant={"subtitle1"} align={"center"}>Given a word, select the correct meaning.</Typography>
      </Container>
      <PracticeWordsWithSelection
        key={currentPosition} word={props.words[currentPosition]} onNext={onNext}
        // @ts-ignore
        optionWords={getSimilarWords(props.words[currentPosition], 3)} position={1}
      />
    </Box>
}