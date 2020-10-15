import React, {useState, useEffect} from "react";
import {Box, Container, LinearProgress, Paper, Typography} from "@material-ui/core";
import {MeaningSelection} from "./MeaningSelection";
import {Word, useWords, Category, getSimilarWords} from "../data/Word";

type PracticeViewBaseProps = {
  words: Word[]
}

export const PracticeViewBase: React.FC<PracticeViewBaseProps> = (props) => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const onNext = (wasCorrect: boolean) => {
    setCurrentPosition(previous => previous+1);
    if (wasCorrect) {
      setCorrectAnswers(previous => previous + 1);
    }
  }
  return <Box width={500} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
      <LinearProgress variant={"determinate"} style={{width: "100%"}} value={1}/>
      <Box className={"ShowProgress"} display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
        <Container>
          <Typography variant={"subtitle1"}>Correct</Typography>
          <Typography variant={"h6"}>{correctAnswers}</Typography>
        </Container>
        <Container>
          <Typography variant={"subtitle1"}>Incorrect</Typography>
          <Typography variant={"h6"}>{currentPosition - correctAnswers}</Typography>
        </Container>
        <Container>
          <Typography variant={"subtitle1"}>Total</Typography>
          <Typography variant={"h6"}>{currentPosition}/{props.words.length}</Typography>
        </Container>
      </Box>
      <Container className={"explanation"}>
        <Typography variant={"subtitle1"} align={"center"}>Given a word, select the correct meaning.</Typography>
      </Container>
      <MeaningSelection
        key={currentPosition} word={props.words[currentPosition]} onNext={onNext}
        // @ts-ignore
        optionWords={getSimilarWords(props.words[currentPosition], 3)} position={1}
      />
    </Box>
}