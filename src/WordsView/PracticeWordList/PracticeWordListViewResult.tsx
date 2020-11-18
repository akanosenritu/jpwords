import React from "react";
import {Box, Button, Grid, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {loadPracticeHistory} from "../../data/Storage/PracticeHistory";
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
    const practiceHistory = loadPracticeHistory();
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
        if (nextPracticeDate.getTime() - Date.now()) {
            countReviewed += 1
        } else {
            countNeedsReview += 1
        }
    }
    const progress = 100 * (countNeedsReview + countReviewed) / props.wordList.wordCount;
    return <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
        <Typography variant={"h5"}>Practice Result</Typography>
        <div className={classes.box}>
            <Typography variant={"h6"}>Overall progress</Typography>
            <Box mt={2}>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <div style={{textAlign: "center"}}>
                            Reviewed:
                            <div>
                                <Typography variant={"h4"} style={{color: "#91ee91"}}>{countReviewed}</Typography>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <div style={{textAlign: "center"}}>
                            Needs review:
                            <div>
                                <Typography variant={"h4"} style={{color: "#ffd899"}}>{countNeedsReview}</Typography>
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
                                <Typography variant={"h4"} style={{color: "#91ee91"}}>{progress.toFixed(1)} %</Typography>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </div>
        <Button onClick={props.continuePractice}>Continue</Button>
    </Box>
};