import React, {useContext, useState} from "react";
import {WordType} from "../../../data/Word/Word";
import {Box, Button, Dialog} from "@material-ui/core";
import {sample} from "lodash";
import {PracticeWordWithInput} from "../../../PracticeMethods/PracticeWordWithInput/PracticeWordWithInput";
import {DebugContext} from "../../../General/Contexts";
import {WordNotes} from "../../../data/WordNotes/WordNote";
import ReportIcon from '@material-ui/icons/Report';
import {ReportProblem} from "../ReportProblem";
import {ProgressBar} from "./ProgressBar";

type PracticeViewBaseProps = {
  words: WordType[],
  reversed: boolean,
  finishPractice: (wordsDone: WordType[], practiceQualities: number[]) => void
}

export const Trainer2: React.FC<PracticeViewBaseProps> = props => {
  const [wordQueue, setWordQueue] = useState<number[]>(Array.from(Array(props.words.length).keys()));
  const [wordsStatus, setWordsStatus] = useState<number[]>(Array(props.words.length).fill(0));
  const [practiceQualities, setPracticeQualities] = useState<number[]>(Array(props.words.length).fill(7))
  const numberDoneWords = wordsStatus.filter(wordStatus => wordStatus === 1).length;
  const isDebugging = useContext(DebugContext);
  const onNext = (wasCorrect: boolean) => {
    if (wasCorrect && wordQueue.length === 1) {
      props.finishPractice(props.words, practiceQualities);
      return;
    }
    setPracticeQualities(practiceQualities => {
      const newPracticeQualities = [...practiceQualities];
      let newPracticeQuality = newPracticeQualities[wordQueue[0]] - 2;
      if (newPracticeQuality < 0) {
        newPracticeQuality = 0
      }
      newPracticeQualities[wordQueue[0]] = newPracticeQuality
      return newPracticeQualities;
    })
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
        console.log(`the answer was not correct, therefore inserted ${props.words[currentWord].kanji} ${pos} words later. Current word queue is:`, newWordQueue);
      }
      return newWordQueue;
    })
  };
  const word = props.words[wordQueue[0]];
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  return <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} mt={2}>
    <ProgressBar progress={numberDoneWords * 100 / props.words.length} />
    <PracticeWordWithInput word={word} onNext={onNext} key={`${word.kanji}-${word.kana}-${word.meaning}-${practiceQualities[wordQueue[0]]}`}/>
    <WordNotes word={word}/>
    <div>
      <Button size={"small"} onClick={()=>setIsDialogueOpen(!isDialogueOpen)}>
        Report problems <ReportIcon />
      </Button>
      <Dialog open={isDialogueOpen} onClose={()=>setIsDialogueOpen(false)}>
        <ReportProblem word={word} />
      </Dialog>
    </div>
    {isDebugging && <div>
      <p>DEBUG INFORMATION: Word Queue</p>
      {wordQueue.map((wordNum, index) => {
        return <div
          key={wordNum}>{index.toString()} {props.words[wordNum].kanji}({wordNum.toString()}) {props.words[wordNum].kana} {props.words[wordNum].meaning}</div>
      })}
    </div>}
  </Box>
};