import wordData from "../words.json";
import {WordNoteType} from "../WordNotes/WordNote";

const prepareAvailableWords = (): {[key: string]: WordType}  => {
  let availableWords: { [key: string]: WordType } = {};
  for (let wordDatum of wordData.words) {
    const word: WordType = {
      uuid: wordDatum.uuid,
      kana: wordDatum.kana,
      kanji: wordDatum.kanji,
      meaning: wordDatum.meaning,
      category: wordDatum.category as Category[]
    };
    availableWords[word.uuid] = word
  }
  return availableWords;
}

export const availableWords = prepareAvailableWords();
export const wordsDataLastEditDate = wordData.lastEdit;

export const categoryList = [
  '',
  // nouns
  'n',
  'n-t',  // nouns related to time
  'n-vs',  // nouns that can be derived into a verb with -suru.
  'n-adj-na',  // nouns that can be derived into an adjective with -na.
  'num',  // numbers
  'n col',  // ??????
  'n-adv',  // nouns that can be used adverbially
  'n-suf',  // nouns that can be used as a suffix
  // adjectives
  'adj',
  'na-adj',  // adjectives that ends with -na.
  'no-adj',  // adjectives that ends with -no.
  'adj-pn',  // demonstrative adjective
  // verbs
  'kuru-v',   // verbs that ends with -kuru. Class 3 verbs.
  'suru-v',  // verbs that ends with -suru.  Class 3 Verbs.
  'aru-v',  // verbs that ends with -aru.
  'ru-v',  // verbs that ends with -ru.  Class 2 Verbs.
  'u-v',  // verbs that ends with -u. Class 1 Verbs.
  'vt',  // transitive verbs
  'vi',  // intransitive verbs
  // adverb
  'adv',
  // conjunctive
  'conj',
  // expression
  'exp', 'expr',
  // interrogative
  'intr',
  // interjection
  'int',
  // suffix
  'suf',
  // prefix
  'pref',
  // particle
  'prt',
  'v5b', 'v5n',
] as const;

type CategoryTuple = typeof categoryList;
export type Category = CategoryTuple[number];

export type WordType = {
  uuid: string,
  kanji: string,
  kana: string,
  category: Category[],
  meaning: string,
  associatedWordNotes?: WordNoteType[]
}


export const prepareWordV2: (arr: string[]) => WordType[] = arr => {
  return arr.map(id => {
    return availableWords[id];
  }) as WordType[]
}

const isAnswerCorrectWithKana = (word: WordType, answer: string): boolean => {
  if (!word.kana) return false
  if (word.kana.replace("～", "") === answer) return true
  return !!word.kana && word.kana === answer
}

const isAnswerCorrectWithKanji = (word: WordType, answer: string): boolean => {
  if (!word.kanji) return false
  if (word.kanji.replace("～", "") === answer) return true
  return !!word.kanji && word.kanji === answer
}

export const searchWords = (searchString: string) => {
  return Object.values(availableWords).filter(word => {
    return word.kana === searchString || word.kanji === searchString
  });
};

type answerEvaluationResultType = "CORRECT" | "WRONG"

export const evaluateAnswer = (word: WordType, answer: string, rejectKana?: boolean): answerEvaluationResultType => {
  if (!rejectKana && isAnswerCorrectWithKana(word, answer)) return "CORRECT"
  return isAnswerCorrectWithKanji(word, answer)? "CORRECT": "WRONG"
}