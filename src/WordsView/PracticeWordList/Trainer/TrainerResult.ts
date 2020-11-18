import {WordList} from "../../../data/WordList";
import {WordType} from "../../../data/Word";

export type TrainerResult = {
    wordList: WordList,
    wordsDone: WordType[],
    practiceQualities: number[]
}