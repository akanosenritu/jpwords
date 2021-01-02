import {get} from "./API";

export type APIWordListType = {
  uuid: string,
  name: string,
  language: string,
  words: string[]
  description: string
}

export const retrieveAPIWordLists = () => {
  return get("word-lists/")
    .then(res => res.json())
    .then(data => data as APIWordListType[])
}

export const isWordUsedInWordList = (wordUUID: string, wordList: APIWordListType): boolean => {
  return wordList.words.includes(wordUUID)
}

export const searchWordLists = (query: RegExp|string, wordLists: APIWordListType[]): APIWordListType[] => {
  return wordLists.filter(wordList => wordList.name.search(query) !== -1)
}