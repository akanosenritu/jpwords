import {Language} from "../data/Language"
import {Failure, Success, SuccessWithData, unknownFailure} from "../General/Result"
import {get, post, put, success} from "./API"
import {APIWordNoteType} from "./APIWordNote"

export type APIWordNoteContentType = {
  uuid: string,
  languages: Language[],
  word_note: string, // uuid of a word note
  content: string,
  last_export: string,
  last_update: string
}

export const createBlankAPIWordNoteContent = (wordNote: APIWordNoteType, languages: Language[]): APIWordNoteContentType => {
  return {
    uuid: "",
    languages: languages,
    word_note: wordNote.uuid,
    content: "",
    last_export: "",
    last_update: ""
  }
}

type GetAPIWordNoteContentSuccess = SuccessWithData<APIWordNoteContentType[]>
export const getAPIWordNoteContent = async (wordNoteUUID: string): Promise<GetAPIWordNoteContentSuccess|Failure> => {
  try {
    const res = await get("word-note-contents/", new Map([["word_note", wordNoteUUID]]))
    const data = await res.json()
    if (res.ok) return {status: "success", data: data}
    return {status: "failure", reason: data.errors}
  } catch {
    return unknownFailure
  }
}

export const updateAPIWordNoteContent = async (wordNoteContent: APIWordNoteContentType): Promise<Success|Failure> => {
  try {
    let res = await put(`word-note-contents/${wordNoteContent.uuid}/`, wordNoteContent)
    if (res.ok) return success
    const data = await res.json()
    return {status: "failure", reason: data.errors}
  } catch {
    return unknownFailure
  }
}

export const createAPIWordNoteContent = async (wordNoteContent: APIWordNoteContentType): Promise<Success|Failure> => {
  try {
    let res = await post("word-note-contents/", wordNoteContent)
    if (res.ok) return success
    const data = await res.json()
    return {status: "failure", reason: data.errors}
  } catch {
    return unknownFailure
  }
}