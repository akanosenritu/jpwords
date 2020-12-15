import React, {useContext, useState} from "react";
import {UserInteractionProps} from "./UserInteractionContext";
import {Box, Button} from "@material-ui/core";
import {DummyGeneratorContext} from "./DummyGeneratorContext";
import {shuffle} from "lodash";

type DummyButtonProps = {
  isDisabled: boolean
}

const DummyButton: React.FC<DummyButtonProps> = (props) => {
  const [isDisabled, setIsDisabled] = useState(false)
  return <Button variant={"outlined"} onClick={()=>setIsDisabled(true)} disabled={isDisabled}>
    {props.children}
  </Button>
}

type AnswerButtonProps = {
  onAnswered: () => void
}

const AnswerButton: React.FC<AnswerButtonProps> = props => {
  const [isAnswered, setIsAnswered] = useState(false)
  const onAnswered = () => {
    setIsAnswered(true)
    props.onAnswered()
  }
  return <Button variant={"outlined"} onClick={()=>onAnswered()} style={{backgroundColor: isAnswered? "#c2f0c2": ""}}>
    {props.children}
  </Button>
}

export const UserInteractionSelection: React.FC<UserInteractionProps> = props => {
  const dummyGenerator = useContext(DummyGeneratorContext)
  const [dummies] = useState(props.dummies? props.dummies: dummyGenerator(3, [props.answer].concat(props.otherPossibleAnswers? props.otherPossibleAnswers: [])))
  const [order] = useState(shuffle(Object.keys(new Array(dummies.length+1).fill(0))).map(v=>parseInt(v)))
  const buttons = dummies.map(dummy => {
    return <DummyButton isDisabled={props.isAnswered} key={dummy}>{dummy}</DummyButton>
  }).concat(<AnswerButton onAnswered={props.onCorrectlyAnswered}>{props.answer}</AnswerButton>)
  return <Box style={{display: "flex", justifyContent: "space-around"}}>
    {order.map(b => buttons[b])}
  </Box>
}