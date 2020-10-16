import React from "react";
import {useLocation, useHistory, useRouteMatch} from "react-router-dom";
import {Box, Button, Typography} from "@material-ui/core";
import {Word} from "../data/Word";
import {usePracticeViewStyles} from "./PracticeViewStyle";


type StartPracticeProps = {
  wordsToPractice: Word[]
}

const StartPracticeOfSelection: React.FC<StartPracticeProps> = (props) => {
  const classes = usePracticeViewStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const onClickStart = () => {
    history.push(`${match.path}/select`, {
      wordsToPractice: props.wordsToPractice
    })
  }
  return <Box className={classes.startPractice} mt={2} mx={1} p={1}>
    <Typography variant={"h6"}>Selection</Typography>
    <Typography variant={"body1"}>Given a Japanese word, select its meaning.</Typography>
    <Button color={"primary"} variant={"contained"} onClick={onClickStart}>Start</Button>
  </Box>
}

const StartPracticeOfSelectionReversed: React.FC<StartPracticeProps> = props => {
  const classes = usePracticeViewStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const onClickStart = () => {
    history.push(`${match.path}/reverseSelect`, {
      wordsToPractice: props.wordsToPractice
    })
  }
  return <Box className={classes.startPractice} mt={2} mx={1} p={1}>
    <Typography variant={"h6"}>Selection Reversed</Typography>
    <Typography variant={"body1"}>Given a meaning(s), select the Japanese word of that meaning.</Typography>
    <Button color={"primary"} variant={"contained"} onClick={onClickStart}>Start</Button>
  </Box>
}

type PracticeTypeSelectionViewLocationState = {
  wordsToPractice: Word[]
}

export const PracticeTypeSelectionView: React.FC = () => {
  const location = useLocation<PracticeTypeSelectionViewLocationState>();
  const wordsToPractice = location.state?.wordsToPractice;
  return <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} position={"center"}>
    <Typography variant={"h5"}>Select practice type</Typography>
    <StartPracticeOfSelection wordsToPractice={wordsToPractice} />
    <StartPracticeOfSelectionReversed wordsToPractice={wordsToPractice} />
  </Box>
}