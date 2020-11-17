import React from "react";
import * as wanakana from "wanakana";
import {isHiragana} from "wanakana";
import {fit} from "furigana";
import wordData from "./words.json";

const prepareAvailableWords = () => {
  let availableWords: {[key:string]: any} = {};
  for (let word of wordData.words) {
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

export type Word = {
  num: number,
  kanji: string,
  kana: string,
  category: Category[],
  meaning: string
}

export type WordTypeV2 = {
  uuid: string,
  kanji: string,
  kana: string,
  category: Category[],
  meaning: string
}

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
  word: WordTypeV2
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

export const prepareWordV2: (arr: string[]) => WordTypeV2[] = arr => {
  return arr.map(id => {
    return availableWords[id];
  }) as WordTypeV2[]
}

export const isPossibleToMakeVerbWithSuru = (word: WordTypeV2) => {
  const categories = word.category;
  for (let category of categories) {
    if (category === "vs") {
      return true
    }
  }
  return false
}