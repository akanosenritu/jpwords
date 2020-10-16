import React, {ChangeEvent, useState} from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem
} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {categoryList, loadWordsByIndex} from "../data/Word";
import {shuffle} from "lodash";

const useStyles = makeStyles({
  startPractice: {
    border: "1px black solid",
    borderRadius: "5px / 5px",
    width: "100%"
  }
})

const StartPracticeByIndex: React.FC = () => {
  const classes = useStyles();
  const [startIndex, setStartIndex] = useState("0");
  const onChangeStartIndex = (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setStartIndex(event.currentTarget.value)
  };
  const [endIndex, setEndIndex] = useState("100");
  const onChangeEndIndex = (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setEndIndex(event.currentTarget.value)
  };
  const [isRandom, setIsRandom] = useState(false);
  const handleCheckRandom = (event: ChangeEvent<HTMLInputElement>) => {
    setIsRandom(event.currentTarget.checked)
  }
  const history = useHistory();
  const onClickStart = () => {
    let wordsToPractice = loadWordsByIndex(parseInt(startIndex), parseInt(endIndex)+1)
    if (isRandom) wordsToPractice = shuffle(wordsToPractice);
    history.push(`/practice/byIndex`, {
      wordsToPractice: wordsToPractice
    });
  }
  return <Box className={classes.startPractice} mt={2} p={1}>
    <Typography variant={"h6"}>Words by index</Typography>
    <Typography variant={"subtitle2"}>Consult with the list <a href={"https://jlptstudy.net/N5/?vocab-list"}>here</a></Typography>
    <Box mt={2} >
      <TextField value={startIndex} onChange={onChangeStartIndex}/> -
      <TextField value={endIndex} onChange={onChangeEndIndex}/>
    </Box>
    <Box mt={2}>
      <FormControlLabel control={<Checkbox checked={isRandom} onChange={handleCheckRandom} />} label={"Randomize"} />
      <Button variant={"contained"} size={"small"} color={"primary"} onClick={onClickStart}>Start</Button>
    </Box>
  </Box>
};

const StartPracticeByCategory: React.FC = () => {
  const classes = useStyles();
  const [category, setCategory] = useState("");
  const handleChangeOnSelect = (event: any) => {
    const selected = event.target.value;
    console.log(selected);
    setCategory(selected);
  };
  const onClickStart = () => {
  }
  return <Box className={classes.startPractice} mt={2} p={1}>
    <Typography variant={"h6"}>Words by category</Typography>
    <div>
      <Typography variant={"subtitle2"}>Available categories are:  {categoryList.join(", ")}</Typography>
      <Typography variant={"subtitle1"} style={{color: "red"}}>NOT IMPLEMENTED</Typography>
    </div>
    <Box mt={2} >
      <Select value={category} style={{width: "80%"}} onChange={handleChangeOnSelect}>
        {categoryList.map(category => {
          return <MenuItem value={category}>{category}</MenuItem>
        })}
      </Select>
    </Box>
    <Box mt={2}>
      <Button variant={"contained"} size={"small"} color={"primary"} onClick={onClickStart} disabled>Start</Button>
    </Box>
  </Box>
}

export const PracticeViewEntrance: React.FC = () => {
  return <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} position={"center"}>
    <Typography variant={"h5"}>Select words to practice</Typography>
    <StartPracticeByIndex />
    <StartPracticeByCategory />
  </Box>

}