import React from "react";
import {useLocation, useHistory, useRouteMatch} from "react-router-dom";
import {Box, Button, Typography} from "@material-ui/core";
import {Word} from "../data/Word";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
  startPractice: {
    border: "1px black solid",
    borderRadius: "5px / 5px",
    width: "100%"
  }
})

type StartPracticeProps = {
  wordsToPractice: Word[]
}

const StartPracticeOfSelection: React.FC<StartPracticeProps> = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const onClickStart = () => {
    history.push(`${match.path}/select`, {
      wordsToPractice: props.wordsToPractice
    })
  }
  return <Box className={classes.startPractice} mt={2} p={1}>
    <Typography variant={"h6"}>Selection</Typography>
    <Typography variant={"body1"}>Given four options, choose the most appropriate one.</Typography>
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
  </Box>
}