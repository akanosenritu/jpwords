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

