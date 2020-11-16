import React, {useState} from "react";
import {useLocation} from "react-router-dom";
import {getSimilarWords, Word} from "../../../data/Word";
import {Box, Button, Container, LinearProgress, Typography} from "@material-ui/core";
import {PracticeWordWithSelection} from "../../../PracticeMethods/PracticeWordWithSelection";
import {sample} from "lodash";
import {PracticeWordWithInput} from "../../../PracticeMethods/PracticeWordWithInput";

type PracticeViewBaseProps = {
    words: Word[],
    reversed: boolean,
    finishPractice: (wordsDone: Word[]) => void
}

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
            props.finishPractice(props.words);
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
    return <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
        <LinearProgress variant={"determinate"} style={{width: "100%"}} value={numberDoneWords * 100 / props.words.length}/>
        <PracticeWordWithInput word={word} onNext={onNext} />
        {isDebugging && <div>
            <p>DEBUG INFORMATION: Word Queue</p>
            {wordQueue.map((wordNum, index) => {
                return <div key={wordNum}>{index.toString()} {props.words[wordNum].kanji}({wordNum.toString()}) {props.words[wordNum].kana} {props.words[wordNum].meaning}</div>
            })}
        </div>}
    </Box>
};