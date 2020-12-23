import {get, post, put} from "./API";

export type APIWordType = {
  uuid: string,
  kanji: string,
  kana: string,
  category: string[]
  meaning: string
}

export const retrieveAPIWords = () => {
  return get("words/")
    .then(res => res.json())
    .then(data => data as APIWordType[])
}

type RetrieveAPIWordsWithPaginationResult = {
  words: APIWordType[],
  total: number
}

export const retrieveAPIWordsWithPagination = (limit: number, offset: number): Promise<RetrieveAPIWordsWithPaginationResult> => {
  return get("words/", new Map([["limit", limit.toString()], ["offset", offset.toString()]]))
    .then(res => res.json())
    .then(data => {
      return {
        words: data.results as APIWordType[],
        total: data.count
      }
    })
}

export const updateAPIWord = (word: APIWordType) => {
  return put(`words/${word.uuid}/`, word)
    .then(res => res.json())
    .then(data => data as APIWordType)
}

export const createAPIWord = (word: APIWordType) => {
  return post(`words/`, word)
    .then(res => res.json())
    .then(data => data as APIWordType)
}

