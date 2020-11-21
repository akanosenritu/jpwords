import React from "react";
import * as wanakana from "wanakana";
import {isHiragana} from "wanakana";
import {fit} from "furigana";
import wordData from "./words.json";

const prepareAvailableWords = () => {
  let availableWords: {[key:string]: any} = {};
  for (let wordDatum of wordData.words) {
    const word: WordType = {
      uuid: wordDatum.uuid,
      kana: wordDatum.kana,
      kanji: wordDatum.kanji,
      meaning: wordDatum.meaning,
      category: wordDatum.category.split(",") as Category[]
    };
    availableWords[word.uuid] = word
  }
  return availableWords;
}

export const availableWords = prepareAvailableWords();

export const categoryList = ['adj-pn', 'u-v-i', 'adj', 'vt', 'vk', 'number', 'n-temp', 'conj', 'n-adv',
                              'n-t', 'adj-no', 'u-v', 'vs', 'int', 'n col', 'pref', 'vs-i', 'exp', 'expr', 'gn',
                              'kana only', 'adv', 'suf', 'no-adj', 'p-suru', 'vi', 'n', 'ru-v', 'na-adj', 'num',
                              'uk', 'n-suf', 'v5n', 'gn-adv', 'prt', 'pren-adj', 'prefix', ''] as const;

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