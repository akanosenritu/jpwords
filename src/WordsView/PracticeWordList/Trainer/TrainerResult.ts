import {WordList} from "../../../data/WordList";
import {Word} from "../../../data/Word";

export type TrainerResult = {
    wordList: WordList,
    correctAnswers: Word[]
    wrongAnswers: Word[],
}