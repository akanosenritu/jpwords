import React, {useState, useEffect} from "react";
import {Box, Container, LinearProgress, Paper, Typography, makeStyles, IconButton, Button} from "@material-ui/core";
import {useSpring, animated} from "react-spring";
import {Word} from "../data/Word";

type OptionProps = {
  word: Word,
  isCorrect: boolean,
  onAnswered: () => void,
  isAnswered: boolean
}

export const CorrectOption: React.FC<OptionProps> = (props) => {
  return <Button onClick={props.onAnswered} style={{textTransform: "none"}}>
    <Typography variant={"h6"}>{props.word.meaning}
      {props.isAnswered &&  " ○"}
    </Typography>
  </Button>
};


export const WrongOption: React.FC<OptionProps> = (props) => {
  return <div>
    <Button onClick={props.onAnswered} style={{textTransform: "none"}} disabled={props.isAnswered}>
      <Typography variant={"h6"}>{props.word.meaning}
        {props.isAnswered &&  " ×"}
      </Typography>
    </Button>
    {props.isAnswered && <Typography variant={"subtitle1"}>{props.word.kanji} ({props.word.kana})</Typography>}
  </div>
}
