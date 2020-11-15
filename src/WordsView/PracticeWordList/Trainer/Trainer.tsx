import React, {useState} from "react";
import {useLocation} from "react-router-dom";
import {getSimilarWords, Word} from "../../../data/Word";
import {Box, Button, Container, LinearProgress, Typography} from "@material-ui/core";
import {PracticeWithSelection} from "../../../PracticeMethods/PracticeWithSelection";
import {sample} from "lodash";
import {PracticeWithInput} from "../../../PracticeMethods/PracticeWithInput";

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
            <PracticeWithSelection type={props.reversed? "EtJ": "JtE"}
                                   key={currentPosition} word={props.words[currentPosition]} onNext={onNext}
                // @ts-ignore
                                   optionWords={getSimilarWords(props.words[currentPosition], 3)} position={sample([0, 1, 2, 3])}
            />: <Box mt={2}>
                <Button onClick={finishPractice}>View Result</Button>
            </Box>
        }
    </Box>
};

export const Trainer2: React.FC<PracticeViewBaseProps> = props => {
    const location = useLocation();
    const params = new URLSearchParams(location.search.substring(1));
    const debug = params.get("debug");
    const isDebugging = !!debug;
    const [wordQueue, setWordQueue] = useState<number[]>(Array.from(Array(props.words.length).keys()));
    const [wordsStatus, setWordsStatus] = useState<number[]>(Array(props.words.length).fill(0));
    const numberDoneWords = wordsStatus.filter(wordStatus => wordStatus === 1).length;
    const onNext = (wasCorrect: boolean) => {
        if (wasCorrect && wordQueue.length === 1) {
            props.finishPractice(props.words, []);
            return;
        }
        setWordsStatus(wordsStatus => {
            const newWordsStatus = [...wordsStatus];
            if (wasCorrect) {
                newWordsStatus[wordQueue[0]] += 1;
            }
            return newWordsStatus
        });
        setWordQueue(wordQueue => {
            const currentWord = wordQueue[0];
            const newWordQueue = [...wordQueue.slice(1)];
            if (!wasCorrect) {
                const pos = sample([2, 3, 4]) as number;
                newWordQueue.splice(pos, 0, currentWord);
            }
            return newWordQueue;
        })
    };
    const word = props.words[wordQueue[0]];
    console.log(props.words);
    console.log("status", wordsStatus);
    console.log("queue", wordQueue);
    return <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
        <LinearProgress variant={"determinate"} style={{width: "100%"}} value={numberDoneWords * 100 / props.words.length}/>
        <PracticeWithInput word={word} onNext={onNext} />
        {isDebugging && <div>
            <p>DEBUG INFORMATION: Word Queue</p>
            {wordQueue.map((wordNum, index) => {
                return <div>{index.toString()} {props.words[wordNum].kanji}({wordNum.toString()}) {props.words[wordNum].kana} {props.words[wordNum].meaning}</div>
            })}
        </div>}
    </Box>
};