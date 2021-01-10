import {get} from "./API";
import {APIWordType} from "./APIWord";

export type APIWordListType = {
  uuid: string,
  name: string,
  language: string,
  words: APIWordType[],
  description: string
}

export type ConciseAPIWordListType = {
  uuid: string,
  name: string,
  language: string
}

export const retrieveAPIWordLists = () => {
  return get("word-lists/")
    .then(res => res.json())
    .then(data => data as APIWordListType[])
}

export const isWordUsedInWordList = (wordUUID: string, wordList: APIWordListType): boolean => {
  return wordList.words.findIndex(word => word.uuid === wordUUID) !== -1
}

export const searchWordLists = (query: RegExp|string, wordLists: APIWordListType[]): APIWordListType[] => {
  return wordLists.filter(wordList => wordList.name.search(query) !== -1)
}