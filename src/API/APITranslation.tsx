import {Language} from "../data/Language";
import {Failure, post, put} from "./API";

export type APITranslation = {
  uuid: string,
  language: Language
  text: string
}
export type UnsavedAPITranslation = {
  language: Language,
  text: string
}
export const createUnsavedAPITranslation = (language: Language): UnsavedAPITranslation => {
  return {
    language: language,
    text: ""
  }
}

type CreateTranslationSuccess = {
  status: "success",
  translation: APITranslation
}
type CreateTranslationResult = CreateTranslationSuccess | Failure

export const createTranslation = (language: Language, text: string): Promise<CreateTranslationResult> => {
  return post("translations/", {
    language: language,
    text: text
  })
    .then(res => {
      return res.json()
        .then(data => {
          if (res.ok) return {status: "success", translation: data} as CreateTranslationSuccess
          return {status: "failure", reason: data.error} as Failure
        })
    })
    .catch(err => {
      return {status: "failure", reason: "unknown reason"} as Failure
    })
}

type UpdateTranslationSuccess = {
  status: "success",
  translation: APITranslation
}
type UpdateTranslationResult = UpdateTranslationSuccess | Failure
export const updateTranslation = (translation: APITranslation): Promise<UpdateTranslationResult> => {
  return put(`translations/${translation.uuid}/`, translation)
    .then(res => {
      return res.json()
        .then(data => {
          if (res.ok) return {status: "success", translation: data} as UpdateTranslationSuccess
          return {status: "failure", reason: data.error} as Failure
        })
    })
    .catch(err => {
      return {status: "failure", reason: "unknown reason"} as Failure
    })
}