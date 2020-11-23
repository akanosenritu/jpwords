import React from "react";
import * as wanakana from "wanakana";
import {fit} from "furigana";
import wordData from "./words.json";

const prepareAvailableWords = () => {
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
  '', ' intrans-verb', ' na-adj', ' vs', 'adj', 'adj-na', 'adj-no', 'adj-pn', 'adjn', 'adv', 'aru-v', 'conj', 'exp', 'expr',
  'giku n', 'gn', 'gn-adv', 'int', 'int-n', 'kana only', 'n', 'n col', 'n-adv', 'n-suf', 'n-t', 'n-temp', 'na-adj', 'no--adj',
  'no-adj', 'num', 'number', 'p-suru', 'pref', 'prefix', 'pren-adj', 'prt', 'ru-v', 'suf', 'u-v', 'u-v-i', 'uk', 'v5b', 'v5n',
  'vi', 'vk', 'vs', 'vs-i', 'vt'
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

type DisplayWordWithFuriganaProps = {
  word: WordType
}

export const DisplayWordWithFurigana: React.FC<DisplayWordWithFuriganaProps> = props => {
  let displayed = [<span key={props.word.kana}>{props.word.kana}</span>];
  if (props.word.kanji && wanakana.isHiragana(props.word.kana)) {
    const tokens = fit(props.word.kanji, props.word.kana, {type: "object"});
    if (tokens) {
      displayed = tokens.map(token => {
        const {w, r} = token;
        if (w === r) return <span key={w}>{w}</span>;
        else {
          return <ruby key={w}>
            {w}
            <rt>{r}</rt>
          </ruby>
        }
      });
    }
  }
  return <span>{displayed}</span>
};

export const prepareWordV2: (arr: string[]) => WordType[] = arr => {
  return arr.map(id => {
    return availableWords[id];
  }) as WordType[]
}

export const isPossibleToMakeVerbWithSuru = (word: WordType) => {
  return word.category.includes("vs")
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