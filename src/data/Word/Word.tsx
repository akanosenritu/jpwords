import React from "react";
import wordData from "../words.json";
import * as uuid from "uuid"

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
  similarWordUUIDs?: string[]
}


export const prepareWordV2: (arr: string[]) => WordType[] = arr => {
  return arr.map(id => {
    return availableWords[id];
  }) as WordType[]
}

export const getDerivatives = (word: WordType) => {
  type Derivative = {
    type: string,
    word: WordType
  }
  const result: Derivative[] = [];
  if (word.category.includes("n-vs")) {
    result.push({
      type : "Verb",
      word: {
        uuid: uuid.v4(),
          kana: word.kana + "する",
        kanji: word.kanji + "する",
        category: ["suru-v"],
        meaning: "(this word is auto-generated)"
      }
    })
  }
  if (word.category.includes("n-adj-na")) {
    result.push({
      type : "Adjective",
      word: {
        uuid: uuid.v4(),
        kana: word.kana + "な",
        kanji: word.kanji + "な",
        category: ["na-adj"],
        meaning: "(this word is auto-generated)"
      }
    })
  }
  return result
}

export const isAnswerCorrect = (word: WordType, answer: string): boolean => {
  if (word.kana) {
    if (word.kana.replace("～", "") === answer) {
      return true
    }
    if (word.kana === answer) {
      return true
    }
  }
  if (word.kanji) {
    if (word.kanji.replace("～", "") === answer) {
      return true
    }
    if (word.kanji === answer) {
      return true
    }
  }
  return false
}

export const searchWords = (searchString: string) => {
  return Object.values(availableWords).filter(word => {
    return word.kana === searchString || word.kanji === searchString
  });
};

type answerEvaluationResultType = "CORRECT" | "CORRECT, BUT NOT WHAT I EXPECTED" | "WRONG"

export const evaluateAnswer = (word: WordType, answer: string): answerEvaluationResultType => {
  if (isAnswerCorrect(word, answer)) {
    return "CORRECT";
  }
  let words = [];
  if (word.similarWordUUIDs) {
    for (let similarWordUUID of word.similarWordUUIDs) {
      words.push(availableWords[similarWordUUID]);
    }
  }
  for (let wordCandidate of words) {
    if (isAnswerCorrect(wordCandidate, answer)) {
      return "CORRECT, BUT NOT WHAT I EXPECTED"
    }
  }
  return "WRONG"
}