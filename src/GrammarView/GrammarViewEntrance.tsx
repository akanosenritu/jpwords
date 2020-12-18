import React from "react";
import {Box, Button, Card, CardActions, CardContent, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom"
import sentencePatternsProblemsData from "../data/Grammar/SentencePatterns/sentencePatternProblems.json"
import particlesProblemsData from "../data/Grammar/Particles/particleProblems.json"

export const useStyles = makeStyles({
  startPractice: {
    border: "1px black solid",
    borderRadius: "5px / 5px",
    textAlign: "center",
    width: "90%"
  },
  startPracticeWordListCard: {
    minWidth: 275,
    textAlign: "left",
    backgroundColor: "#f2f2f2"
  },
});

type PracticeCardSentencePatternProps = {
  sentencePattern: string,
  nPractices: number
}

const PracticeCardSentencePattern: React.FC<PracticeCardSentencePatternProps> = props => {
  const history = useHistory()
  const onClickStart = () => {
    history.push(`/grammar/sentencePatterns/${props.sentencePattern}`)
  }
  const classes = useStyles()
  return <Card className={classes.startPracticeWordListCard} variant={"outlined"}>
    <CardContent>
      <Typography variant={"h6"}>{props.sentencePattern} ({props.nPractices} practices)</Typography>
      <Typography variant={"body1"}>Practice how to use {props.sentencePattern} in various situations.</Typography>
    </CardContent>
    <CardActions style={{justifyContent: "center"}}>
      <Button variant={"contained"} size={"small"} color={"primary"} onClick={onClickStart}>Start</Button>
    </CardActions>
  </Card>
}

type PracticeCardParticlesProps = {
  nPractices: number
}

const PracticeCardParticles: React.FC<PracticeCardParticlesProps> = props => {
  const history = useHistory()
  const onClickStart = () => {
    history.push(`/grammar/particles`)
  }
  const classes = useStyles()
  return <Card className={classes.startPracticeWordListCard} variant={"outlined"}>
    <CardContent>
      <Typography variant={"h6"}>Particles ({props.nPractices} practices)</Typography>
    </CardContent>
    <CardActions style={{justifyContent: "center"}}>
      <Button variant={"contained"} size={"small"} color={"primary"} onClick={onClickStart}>Start</Button>
    </CardActions>
  </Card>
}

export const GrammarViewEntrance: React.FC = (props) => {
  return <div style={{minWidth: 320, maxWidth: 500, margin: "auto", position:"relative"}}>
    <Box mt={2} p={1}>
      <Box style={{borderLeft: "2px solid lightgray", paddingLeft: 10}}>
        <Typography variant={"h6"}>Sentence Patterns Practices</Typography>
      </Box>
      <Box mt={2}>
        {Object.entries(sentencePatternsProblemsData.sentencePatterns).map(kv => {
          return <PracticeCardSentencePattern sentencePattern={kv[0]} nPractices={kv[1]} />
        })}
      </Box>
    </Box>
    <Box mt={2} p={1}>
      <Box style={{borderLeft: "2px solid lightgray", paddingLeft: 10}}>
        <Typography variant={"h6"}>Particles Practices</Typography>
      </Box>
      <Box mt={2}>
        <PracticeCardParticles nPractices={particlesProblemsData.total} />
      </Box>
    </Box>
  </div>
};