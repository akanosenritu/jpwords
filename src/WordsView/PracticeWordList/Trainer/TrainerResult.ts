import {WordList} from "../../../data/WordList";
import {Word, WordTypeV2} from "../../../data/Word";

export type TrainerResult = {
    wordList: WordList,
    wordsDone: WordTypeV2[],
    practiceQualities: number[]
}