import React, {useState} from "react";
import {useHistory, useRouteMatch} from "react-router-dom";
import {getSimilarWords, Word} from "../../../data/Word";
import {Box, Button, Container, LinearProgress, Typography} from "@material-ui/core";
import {PracticeWordsWithSelection} from "../../Practice/PracticeWordsWithSelection";
import {sample} from "lodash";
import {TrainerResult} from "./TrainerResult";

type PracticeViewBaseProps = {
    words: Word[],
    reversed: boolean,
    finishPractice: (correct: Word[], wrong: Word[]) => void
}

export const TrainerBase: React.FC<PracticeViewBaseProps> = (props) => {
    const [currentPosition, setCurrentPosition] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState<Word[]>([]);
    const [wrongAnswers, setWrongAnswers] = useState<Word[]>([]);
    const onNext = (wasCorrect: boolean) => {
        if (wasCorrect) {
            setCorrectAnswers(arr => arr.concat(props.words[currentPosition]))
        } else {
            setWrongAnswers(arr => arr.concat(props.words[currentPosition]))
        }
        setCurrentPosition(previous => {
            return previous + 1
        });
    };
    const finishPractice = () => {
        props.finishPractice(correctAnswers, wrongAnswers);
    };
    return <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
        <LinearProgress variant={"determinate"} style={{width: "100%"}} value={currentPosition * 100 / props.words.length}/>
        <Box className={"ShowProgress"} display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
            <Container>
                <Typography variant={"subtitle2"}>Correct</Typography>
                <Typography variant={"body1"}>{correctAnswers.length}</Typography>
            </Container>
            <Container>
                <Typography variant={"subtitle2"}>Incorrect</Typography>
                <Typography variant={"body1"}>{currentPosition - correctAnswers.length}</Typography>
            </Container>
            <Container>
                <Typography variant={"subtitle2"}>Total</Typography>
                <Typography variant={"body1"}>{currentPosition}/{props.words.length}</Typography>
            </Container>
        </Box>
        <Container className={"explanation"}>
            <Typography variant={"subtitle2"} align={"center"}>{props.words.length > currentPosition? "Given a word, select the correct meaning." : "Click the button to view the result"}</Typography>
        </Container>
        {props.words.length > currentPosition?
            <PracticeWordsWithSelection type={props.reversed? "EtJ": "JtE"}
                                        key={currentPosition} word={props.words[currentPosition]} onNext={onNext}
                // @ts-ignore
                                        optionWords={getSimilarWords(props.words[currentPosition], 3)} position={sample([0, 1, 2, 3])}
            />: <Box mt={2}>
                <Button onClick={finishPractice}>View Result</Button>
            </Box>
        }
    </Box>
};