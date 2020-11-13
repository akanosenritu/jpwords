import {Word} from "../../../data/Word";
import React from "react";
import {Box, Card, CardContent, Typography} from "@material-ui/core";
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

type ReviewWordsProps = {
    words: Word[]
}

export const ReviewWords: React.FC<ReviewWordsProps> = props => {
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
};

