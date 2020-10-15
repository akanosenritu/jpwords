import React, {ChangeEvent, useState} from "react";
import {Box, Button, Container, Grid, TextField, Typography} from "@material-ui/core";
import {useHistory} from "react-router-dom";

export const PracticeViewEntrance: React.FC = () => {
  const [startIndex, setStartIndex] = useState("1");
  const onChangeStartIndex = (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setStartIndex(event.currentTarget.value)
  };
  const [endIndex, setEndIndex] = useState("100");
  const onChangeEndIndex = (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setEndIndex(event.currentTarget.value)
  }
  const history = useHistory();
  const onClickStart = () => {
    history.push(`/practice/index/${startIndex}/${endIndex}`);
  }
  return <Box width={500} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
    <Typography variant={"h5"}>Select words to practice</Typography>
    <Typography variant={"subtitle1"}>Specify the start and end index</Typography>
    <Box mt={2} >
      <TextField value={startIndex} onChange={onChangeStartIndex}/> -
      <TextField value={endIndex} onChange={onChangeEndIndex}/>
    </Box>
    <Box mt={2}>
      <Button variant={"contained"} size={"small"} color={"primary"} onClick={onClickStart}>Start</Button>
    </Box>
  </Box>
}