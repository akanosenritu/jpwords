import React from "react";
import {PieChart, Pie, ResponsiveContainer, Cell} from "recharts";
import {Word} from "../../data/Word";
import {useLocation} from "react-router-dom";
import {Box, Card, CardContent, Grid, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  box: {
    border: "1px black solid",
    borderRadius: "5px / 5px",
    width: "100%"
  },
  wordsTable: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1)
    }
  },
}));

type ResultChartProps = {
  total: number,
  correctAnswers: number
}

const ResultChart: React.FC<ResultChartProps> = (props) => {
  const data = [
    {name: "Correct", count: props.correctAnswers, color: "#48D1CC"},
    {name: "Wrong", count: props.total - props.correctAnswers, color: "lightgrey"}
  ]
  return <Box pb={2}>
      <PieChart width={400} height={200}>
        <Pie dataKey={"count"} nameKey={"name"} startAngle={180} endAngle={0} data={data} cx={200} cy={200} outerRadius={80} fill={"$8884d8"} label>
          {data.map((entry, index) => {
            return <Cell key={`cell-${index}`} fill={entry.color} />
          })}
        </Pie>
      </PieChart>
  </Box>
}
type ReviewWordsProps = {
  words: Word[]
}

const ReviewWords: React.FC<ReviewWordsProps> = props => {
  const classes = useStyles();
  return <Box mt={4} className={classes.box}>
    <div  style={{textAlign: "center"}}><Typography variant={"h5"}>Words you answered wrong</Typography></div>
    {props.words.length > 0?
      <Box mt={2}>
        {props.words.map((word, index) => {
          return <Card>
            <CardContent>
              <Typography color={"textSecondary"}>
                {word.num}
              </Typography>
              <Typography variant={"h6"} component={"h3"}>{word.kanji}</Typography>
              <Typography variant={"body1"} component={"h5"}>{word.kana}</Typography>
              <Typography variant={"body2"} component={"p"}>{word.meaning}</Typography>
            </CardContent>
          </Card>
        })}
      </Box>: <div style={{textAlign: "center"}}>
        <Typography variant={"body2"}>You are a genius. You made no mistake.</Typography>
      </div>
    }
  </Box>
}

type PracticeViewResultLocationState = {
  wordsPracticed: Word[],
  wordsCorrectlyAnswered: Word[],
  wordsWronglyAnswered: Word[],
}

export const PracticeViewResult: React.FC = (props) => {
  const classes = useStyles();
  const location = useLocation<PracticeViewResultLocationState>();
  const {wordsPracticed, wordsCorrectlyAnswered, wordsWronglyAnswered} = location.state;
  console.log(wordsPracticed);
  return <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
    <Typography variant={"h4"}>Practice Result</Typography>
    <div className={classes.box}>
      <Box mt={2}>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <div style={{textAlign: "center"}}>
              Correct:
              <div>
                <Typography variant={"h4"} style={{color: "#48D1CC"}}>{wordsCorrectlyAnswered.length}</Typography>
              </div>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div style={{textAlign: "center"}}>
              Wrong:
              <div>
                <Typography variant={"h4"} style={{color: "lightgrey"}}>{wordsWronglyAnswered.length}</Typography>
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>
      <ResultChart total={wordsPracticed.length} correctAnswers={wordsCorrectlyAnswered.length} />
    </div>
    <ReviewWords words={wordsWronglyAnswered} />
  </Box>
}