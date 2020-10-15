import data from "../words.json";
import {Category} from "@material-ui/icons";
import {sample, shuffle} from "lodash";

const categoryList = ['adj-pn', 'u-v-i', 'adj', 'vt', 'vk', 'number', 'n-temp', 'conj', 'n-adv',
                    'n-t', 'adj-no', 'u-v', 'vs', 'int', 'n col', 'pref', 'vs-i', 'exp', 'expr', 'gn',
                    'kana only', 'adv', 'suf', 'no-adj', 'p-suru', 'vi', 'n', 'ru-v', 'na-adj', 'num',
                    'uk', 'n-suf', 'v5n', 'gn-adv', 'prt', 'pren-adj', 'prefix', ''] as const;

type CategoryTuple = typeof categoryList;
export type Category = CategoryTuple[number];

const isCategory = (obj: any): obj is Category => {
  return categoryList.includes(obj);
}

export type Word = {
  num: number,
  kanji: string,
  kana: string,
  category: Category[],
  meaning: string
}

const prepareWords = (arr: string[][]): [Word[], Map<Category, Array<Word>>] => {
  const wordsByCategory = new Map<Category, Array<Word>>();
  categoryList.map(cat => wordsByCategory.set(cat, []));
  console.log(wordsByCategory);
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
    })
    return word
  });
  return [words, wordsByCategory];
};

const [words, wordsByCategory] = prepareWords(data);

export const loadAllWords = () => {
  return words
}

export const useWords = (): [Word[], (category: Category)=>Word] => {
  const [words, wordsByCategory] = prepareWords(data);
  const getRandomWordsByCategory2 = (category: Category) => {
    // @ts-ignore
    return words[wordsByCategory.get(category)[Math.floor(Math.random() * wordsByCategory.get(category).length)]-1]
    }
  return [words, getRandomWordsByCategory2];
}

export const loadWordsByIndex = (start: number, end: number) => {
  if (start < 0) start = 0;
  if (end > words.length) end = words.length;
  return words.slice(start, end)
}

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
  return result;
}