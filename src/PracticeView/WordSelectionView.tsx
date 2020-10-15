import React, {useState, useEffect} from "react";
import {Box, Container, LinearProgress, Paper, TextField, Typography} from "@material-ui/core";
import {MeaningSelection} from "./MeaningSelection";
import {Word, useWords, Category} from "../data/Word";
import {shuffle} from "lodash";


export const WordSelectionView: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(100);
  return <Box width={500} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
    <TextField />
    <TextField />
  </Box>
}