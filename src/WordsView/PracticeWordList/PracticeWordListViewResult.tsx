import React from "react";
import {Box, Button, Grid, Typography} from "@material-ui/core";
import {loadPracticeHistory} from "../../data/Storage/PracticeHistory";
import {WordList} from "../../data/WordLists/WordList";
import {PieChart} from 'react-minimal-pie-chart';
import {getColors} from "../Styles";
import {useHistory} from "react-router-dom";

type ChartProps = {
  reviewed: number,
  needsReview: number,
  untouched: number
}

const Chart: React.FC<ChartProps> = props => {
  const colors = [
    getColors("CORRECT").main,
    getColors("WRONG").main,
    "lightgray"
  ]
  const data = [
    {title: 'Reviewed', value: props.reviewed, color: colors[0]},
    {title: 'NeedsReview', value: props.needsReview, color: colors[1]},
    {title: 'Untouched', value: props.untouched, color: colors[2]},
  ]
  return <PieChart
    data={data}
    lineWidth={15}
    startAngle={180}
    paddingAngle={5}
    animate={true}
    label={({dataEntry}) => {
      const percent = 100 * dataEntry.value / data.map(datum => datum.value).reduce((a, b) => a + b);
      if (percent < 1) {
        return ""
      } else {
        return `${(100 * dataEntry.value / data.map(datum => datum.value).reduce((a, b) => a + b)).toFixed(0)}%`
      }

    }}
    labelStyle={(index) => ({
      fill: colors[index],
      fontSize: "10px"
    })}
  />
}

type PracticeWordListViewResultProps = {
  wordList: WordList,
  continuePractice: () => void
}

export const PracticeWordListViewResult: React.FC<PracticeWordListViewResultProps> = (props) => {
  const practiceHistory = loadPracticeHistory();
  const browserHistory = useHistory();
  let countReviewed = 0;
  let countNeedsReview = 0;
  let countUntouched = 0;
  for (let word of props.wordList.words) {
    const wordHistory = practiceHistory.wordsHistory[word.uuid];
    if (wordHistory === undefined) {
      countUntouched += 1
      continue
    }
    if (wordHistory.nPractices === 0) {
      countUntouched += 1
      continue
    }
    const nextPracticeDate = new Date(wordHistory.nextPracticeDate);
    if (nextPracticeDate.getTime() - Date.now() > 0) {
      countReviewed += 1
    } else {
      countNeedsReview += 1
    }
  }
  const progress = 100 * (countNeedsReview + countReviewed) / props.wordList.wordCount;
  return <Box mt={2}>
    <Box style={{borderLeft: "5px solid darkgray", paddingLeft: 10}}>
      <Typography variant={"h5"}>Progress Overview</Typography>
    </Box>
    <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} mt={2}>
      <Typography variant={"body2"}>Total {countReviewed + countNeedsReview + countUntouched} words</Typography>
      <div style={{width: 250, height: 250, padding: 10}}>
        <Chart reviewed={countReviewed} needsReview={countNeedsReview} untouched={countUntouched}/>
      </div>
    </Box>
    <div>
      <Box mt={2}>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <div style={{textAlign: "center"}}>
              Reviewed:
              <div>
                <Typography variant={"h4"} style={{color: getColors("CORRECT").main}}>{countReviewed}</Typography>
              </div>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div style={{textAlign: "center"}}>
              Needs review:
              <div>
                <Typography variant={"h4"} style={{color: getColors("WRONG").main}}>{countNeedsReview}</Typography>
              </div>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div style={{textAlign: "center"}}>
              Untouched:
              <div>
                <Typography variant={"h4"} style={{color: "lightgray"}}>{countUntouched}</Typography>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div style={{textAlign: "center"}}>
              Total Progress:
              <div>
                <Typography variant={"h4"} style={{color: "#91ee91"}}>{progress.toFixed(1)} %</Typography>
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
    <div>
      <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} mt={2}>
        {countReviewed !== props.wordList.words.length ?
          <Button variant={"outlined"} color={"primary"} onClick={props.continuePractice}>Continue</Button> :
          <Button variant={"outlined"} color={"primary"} onClick={()=>browserHistory.go(0)}>Return to selection</Button>
        }
      </Box>
    </div>
  </Box>
};