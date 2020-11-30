import {WordList} from "../../../data/WordLists/WordList";
import {WordType} from "../../../data/Word/Word";

export type TrainerResult = {
    wordList: WordList,
    wordsDone: WordType[],
    practiceQualities: number[]
}