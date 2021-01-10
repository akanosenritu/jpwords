import {Failure, get, post, put, Success} from "./API";
import {Language} from "../data/Language";
import {APITranslation} from "./APITranslation";
import {ConciseAPIWordListType} from "./APIWordList"

export type APIWordType = {
  uuid: string,
  kanji: string,
  kana: string,
  category: string[]
  meaning: APITranslation[],
  word_lists: ConciseAPIWordListType[]
}

export const retrieveAPIWords = () => {
  return get("words/")
    .then(res => res.json())
    .then(data => data as APIWordType[])
}


// with pagination
type RetrieveAPIWordsWithPaginationSuccess = {
  status: "success",
  words: APIWordType[],
  total: number
}
type RetrieveAPIWordsWithPaginationResult = RetrieveAPIWordsWithPaginationSuccess | Failure

export const retrieveAPIWordsWithPagination = async (params: Map<string, string>): Promise<RetrieveAPIWordsWithPaginationResult> => {
  try {
    const response = await get("words/", params)
    const data = await response.json()
    if (response.ok) {
      return {
        status: "success",
        words: data.results as APIWordType[],
        total: data.count
      }
    } else {
      return {
        status: "failure",
        reason: data.error
      }
    }
  } catch (e) {
    return {
      status: "failure",
      reason: "unknown reason"
    }
  }
}


// update a word
type UpdateAPIWordSuccess = {
  status: "success",
  word: APIWordType
}
type UpdateAPIWordResult = UpdateAPIWordSuccess | Failure

export const updateAPIWord = (word: APIWordType): Promise<UpdateAPIWordResult> => {
  const data = {
    ...word,
    meaning_uuids: word.meaning.map(translation => translation.uuid)
  }
  return put(`words/${word.uuid}/`, data)
    .then(res => res.json()
      .then(data => {
        if (res.ok) return {status: "success", word: data} as UpdateAPIWordSuccess
        return {status: "failure", reason: data.error} as Failure
      })
    )
    .catch(() => {
      return {status: "failure", reason: "unknown reason"} as Failure
    })
}


// create a word
export const createAPIWord = (word: APIWordType) => {
  return post(`words/`, word)
    .then(res => res.json())
    .then(data => data as APIWordType)
}


// delete a word
type DeleteAPIWordResult = Success | Failure

export const deleteAPIWord = (word: APIWordType, replaceToUUID?: string): Promise<DeleteAPIWordResult> => {
  const data: any = {}
  if (replaceToUUID) {
    data["word_replace_to_uuid"] = replaceToUUID
  }
  return post(`words/${word.uuid}/delete_word/`, data)
    .then(res => res.json())
    .then(data => {
      if (data.detail === "success") return {status: "success"} as Success
      return {status: "failure", reason: data.error} as Failure
    })
    .catch(err => {
      return {status: "failure", reason: "unknown reason"} as Failure
    })
}

export const getMeaning = (word: APIWordType, language: Language) => {
  for (const translation of word.meaning) {
    if (translation.language === language) {
      return translation.text
    }
  }
  return ""
}


export const isValidWordUUID = async (wordUUID: string): Promise<boolean> => {
  const response = await get(`words/${wordUUID}/`)
  const data = await response.json()
  return data.detail !== "Not found.";
}