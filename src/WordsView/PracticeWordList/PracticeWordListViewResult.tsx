import React, {useEffect} from "react";
import {PieChart, Pie, Cell} from "recharts";
import {Word} from "../../data/Word";
import {useLocation} from "react-router-dom";
import {Box, Button, Card, CardContent, Grid, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {ReviewWords} from "../Practice/Result/Result";
import {loadPracticeHistory, savePracticeHistory, updatePracticeHistory} from "../../data/PracticeHistory";
import {TrainerResult} from "./Trainer/TrainerResult";
import {WordList} from "../../data/WordList";

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

type PracticeWordListViewResultProps = {
    practiceResult: TrainerResult,
    wordList: WordList,
    continuePractice: () => void
}

export const PracticeWordListViewResult: React.FC<PracticeWordListViewResultProps> = (props) => {
    const classes = useStyles();
    const practiceHistory = loadPracticeHistory(props.wordList);
    let countMastered = 0;
    let countNeedsPractice = 0;
    let countUntouched = 0;
    for (let i=0; i<props.wordList.wordCount; i++) {
        switch (practiceHistory.memorizationStrength[i]) {
            case 0:
                countUntouched += 1;
                break;
            case 5:
                countMastered += 1;
                break;
            default:
                countNeedsPractice += 1;
        }
    }
    const progress = practiceHistory.memorizationStrength.reduce((acc, cur) => acc+ cur) * 20 / props.wordList.wordCount;
    return <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
        <Typography variant={"h5"}>Practice Result</Typography>
        <div className={classes.box}>
            <Typography variant={"h6"}>This iteration</Typography>
            <Box mt={2}>
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <div style={{textAlign: "center"}}>
                            Correct:
                            <div>
                                <Typography variant={"h4"} style={{color: "#48D1CC"}}>{props.practiceResult.correctAnswers.length}</Typography>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div style={{textAlign: "center"}}>
                            Wrong:
                            <div>
                                <Typography variant={"h4"} style={{color: "lightgrey"}}>{props.practiceResult.wrongAnswers.length}</Typography>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Box>
            <Typography variant={"h6"}>Overall progress</Typography>
            <Box mt={2}>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <div style={{textAlign: "center"}}>
                            Mastered:
                            <div>
                                <Typography variant={"h4"} style={{color: "#48D1CC"}}>{countMastered}</Typography>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <div style={{textAlign: "center"}}>
                            Needs Practice:
                            <div>
                                <Typography variant={"h4"} style={{color: "lightgrey"}}>{countNeedsPractice}</Typography>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <div style={{textAlign: "center"}}>
                            Untouched:
                            <div>
                                <Typography variant={"h4"} style={{color: "lightgrey"}}>{countUntouched}</Typography>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div style={{textAlign: "center"}}>
                            Total Progress:
                            <div>
                                <Typography variant={"h4"} style={{color: "lightgrey"}}>{progress.toFixed(1)} %</Typography>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </div>
        <Button onClick={props.continuePractice}>Continue</Button>
        <ReviewWords words={props.practiceResult.wrongAnswers} />
    </Box>
};