import React, {useContext, useState} from "react";
import {Box, Button} from "@material-ui/core";
import {HiddenContext} from "../GrammarView/HiddenContext";
import {shuffle} from "lodash";
import {DummyGeneratorContext} from "../GrammarView/DummyGeneratorContext";

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

type ProblemProps = {
  answer: string,
  otherPossibleAnswers?: string[],
  dummies?: string[],
  translation?: string,
  rationale?: React.ReactElement
}

export const Problem: React.FC<ProblemProps> = props => {
  const [isHidden, setIsHidden] = useState(true)
  const dummyGenerator = useContext(DummyGeneratorContext)
  const [dummies] = useState(props.dummies? props.dummies: dummyGenerator(3, [props.answer].concat(props.otherPossibleAnswers? props.otherPossibleAnswers: [])))
  const [order] = useState(shuffle(Object.keys(new Array(dummies.length+1).fill(0))).map(v=>parseInt(v)))
  const buttons = dummies.map(dummy => {
    return <DummyButton isDisabled={!isHidden} key={dummy}>{dummy}</DummyButton>
  }).concat(<AnswerButton onAnswered={()=>setIsHidden(false)}>{props.answer}</AnswerButton>)
  return <HiddenContext.Provider value={isHidden}>
    <p>{props.children}</p>
    {props.translation && <p style={{marginLeft: 10, fontSize: "1rem"}}>{props.translation}</p>}
    <Box style={{display: "flex", justifyContent: "space-around"}}>
      {order.map(b => buttons[b])}
    </Box>
    {props.rationale && !isHidden &&
      <p style={{marginLeft: 10, fontSize: "1rem", border: "1px solid lightgray", borderRadius: 10, padding: 4, backgroundColor: "#ebfaeb"}} >{props.rationale}</p>
    }
  </HiddenContext.Provider>
}
