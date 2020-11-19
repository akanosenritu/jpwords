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
  meaning: string
}

export const wordTypeExamples = [
  {
    uuid: "6a9b3e61-1eeb-47a2-82ce-31879476770f",
    kanji: "例",
    kana: "れい",
    category: ["n"] as Category[],
    meaning: "example"
  },
  {
    uuid: "22d662b7-98a9-4ef6-b8b7-1763d33f2e2d",
    kanji: "意味",
    kana: "いみ",
    category: ["vs"] as Category[],
    meaning: "meaning"
  }
]

const isAlphabet = (letter: string) => {
  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "abcdefghijklmnopqrstuvwxyz";
  return Array.from(alphabets).includes(letter)
};

const isSymbol = (letter: string) => {
  const symbols = "!\"#$%&'()`|^-=~\\@[{]}:*;+,.<>/?" +
    "！”＃＄％＆’（）￥＾｜～ー＝＠｀「｛；＋：＊」｝、＜。＞・？";
  return Array.from(symbols).includes(letter)
};

const isLetterNoFurigana = (letter: string) => {
  return isHiragana(letter) || isSymbol(letter) || isAlphabet(letter)
};

type Part = {
  main: string
  furigana: string | null
}

export const detectParts = (kanji: string, kana: string) => {
  if (kanji.length < 1) throw new Error();
  const kanjiLetters = Array.from(kanji);
  let res: Part[] = [];
  if (kanji){
    let posKana = 0;
    let kanjiLetter = kanjiLetters.shift();
    if (kanjiLetter === undefined) throw new Error("the argument kanji must not be an empty string");
    let partMain = "";
    while (true) {
      if (kanjiLetter && partMain && isLetterNoFurigana(kanjiLetter)) {
        let posKanaPartEnd = kana.indexOf(kanjiLetter, posKana);
        res.push({
          // @ts-ignore
          main: partMain,
          furigana: kana.slice(posKana, posKanaPartEnd)
        });
        partMain = "";
        posKana = posKanaPartEnd;
      } else {
        // @ts-ignore
        partMain += kanjiLetter;
      }
      if (kanjiLetter && kanjiLetter === kana[posKana]) {
        res.push({
          main: kanjiLetter,
          furigana: null
        });
        posKana += 1;
        partMain = "";
      }
      kanjiLetter = kanjiLetters.shift();
      if (kanjiLetter === undefined) {
        if (partMain) {
          res.push({
            main: partMain,
            furigana: kana.slice(posKana)
          })
        }
        break
      }
    }
    return res;
  }
};

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
  const categories = word.category;
  for (let category of categories) {
    if (category === "vs") {
      return true
    }
  }
  return false
}