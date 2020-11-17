import data from "../words.json";
import {sample, shuffle} from "lodash";
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

export const HiraganaList = [];

type CategoryTuple = typeof categoryList;
export type Category = CategoryTuple[number];

export const isCategory = (obj: any): obj is Category => {
  return categoryList.includes(obj);
};

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

const prepareWords = (arr: string[][]): [Word[], Map<Category, Array<Word>>] => {
  const wordsByCategory = new Map<Category, Array<Word>>();
  categoryList.map(cat => wordsByCategory.set(cat, []));
  const words = arr.map(arr => {
    const word =  {
      num: parseInt(arr[0]),
      kana: arr[1],
      kanji: arr[2],
      category: arr[3].split(",").map(cat => cat.trim() as Category),
      meaning: arr[4]
    };
    word.category.forEach(cat => {
      if (wordsByCategory.has(cat)) {
        // @ts-ignore
        wordsByCategory.get(cat).push(word)
      }
    });
    return word
  });
  return [words, wordsByCategory];
};

const [words, wordsByCategory] = prepareWords(data);

export const loadAllWords = () => {
  return words
};

export const loadWordsByIndex = (start: number, end: number) => {
  if (start < 0) start = 0;
  if (end > words.length) end = words.length;
  return words.slice(start, end)
};

export const getSimilarWords = (word: Word, quantity: number) => {
  const category = word.category.length > 0? word.category[0] : "";
  const availableWords = shuffle(wordsByCategory.get(category));
  if (availableWords === undefined || availableWords.length === 0) {
    throw new Error("No similar words")
  }
  let result: Word[] = [];
  while (result.length < quantity && availableWords.length > 0) {
    const candidate = availableWords.pop();
    if (candidate === undefined) continue;
    if (candidate.meaning === word.meaning) continue;
    result.push(candidate);
  }
  // if got less number of words, fill it randomly with all words
  if (result.length < quantity) {
    while (result.length < quantity) {
       const randomWord = sample(words);
       if (randomWord === undefined) continue;
       if (randomWord.meaning === word.meaning) continue;
       if (result.includes(randomWord)) continue;
       result.push(randomWord);
    }
  }
  return result;
};

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

export const prepareWord2: (arr: string[][]) => Word[] = arr => {
  const words = arr.map(arr => {
    const word = {
      num: parseInt(arr[0]),
      kana: arr[1],
      kanji: arr[2],
      category: arr[3].split(",").map(cat => cat.trim() as Category),
      meaning: arr[4]
    };
    return word as Word;
  });
  return words
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