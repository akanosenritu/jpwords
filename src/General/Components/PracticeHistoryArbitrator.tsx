import React, {useContext} from "react";
import {PracticeHistoryVLatest} from "../../data/PracticeHistory/PracticeHistory";
import {Dialog, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import {calculateProgressForWordList} from "../../data/PracticeHistory/PracticeHistoryUtils";
import {WordListsContext} from "../../data/WordLists/WordListsProvider";

type Props = {
  localHistory: PracticeHistoryVLatest,
  remoteHistory: PracticeHistoryVLatest,
  onArbitrated: (practiceHistory: PracticeHistoryVLatest) => void
}

export const PracticeHistoryArbitrator: React.FC<Props> = props => {
  return <Dialog open={true}>
    <Box m={1}>
      <Typography variant={"h6"}>Please select the practice history that you want to prioritize.</Typography>
      <p>
        Because there is a discrepancy between the data saved in your browser and that in the server, the app cannot decide which it should use.
        Please select one that you want to continue on.
      </p>
      <Grid container spacing={1}>
        <ArbitratorEntry location={"In your browser"} practiceHistory={props.localHistory} onArbitrated={props.onArbitrated} />
        <ArbitratorEntry location={"In the server"} practiceHistory={props.remoteHistory} onArbitrated={props.onArbitrated} />
      </Grid>
    </Box>
  </Dialog>
}

type ArbitratorEntryProps = {
  location: string,
  practiceHistory: PracticeHistoryVLatest,
  onArbitrated: (practiceHistory: PracticeHistoryVLatest) => void
}

const ArbitratorEntry: React.FC<ArbitratorEntryProps> = props => {
  const {wordLists, loadWords} = useContext(WordListsContext)
  return <Grid item xs={6} style={{border: "3px solid darkgray", borderRadius: 10}}>
    <p style={{textAlign: "center", fontWeight: "bold"}}>{props.location}</p>
    <p>
      Last practice: <br />
      <span style={{marginLeft: 10}}>
        {props.practiceHistory.lastPracticeDate}
      </span>
    </p>
    <p>
      Progress for word lists: <br />
      {
        wordLists.map(wordList => {
          if (wordList.status === "initial") {
            loadWords(wordList)
            return <><span style={{marginLeft: 10}}>Loading</span><br /></>
          }
          return <><span style={{marginLeft: 10}}>{wordList.name}: {calculateProgressForWordList(props.practiceHistory, wordList).progress.toFixed(1)}%</span><br /></>
        })
      }
    </p>
    <Box display={"flex"} justifyContent={"center"}>
      <Button color={"primary"} variant={"outlined"} size={"small"} onClick={()=>props.onArbitrated(props.practiceHistory)}>Select</Button>
    </Box>
  </Grid>
}