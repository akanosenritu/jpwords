import {delete_, get, post, put} from "./API";
import {APIWordType} from "./APIWord";
import {Success, Failure, success, unknownFailure} from "../General/Result"

export type APIWordNoteType = {
  uuid: string,
  associated_words: APIWordType[],
  associated_categories: string[],
  title: string,
  is_published: boolean,
}

type POSTableAPIWordNoteType = {
  uuid: string,
  associated_word_uuids: string[],
  associated_categories: string[],
  title: string,
  is_published: boolean
}

const convertAPIWordNoteToPOSTable = (wordNote: APIWordNoteType): POSTableAPIWordNoteType => {
  return {
    ...wordNote,
    associated_word_uuids: wordNote.associated_words.map(word => word.uuid)
  }
}

type RetrieveAPIWordNotesSuccess = {
  status: "success",
  wordNotes: APIWordNoteType[]
}
export const retrieveAPIWordNotes = async (): Promise<RetrieveAPIWordNotesSuccess|Failure> => {
  try {
    const res = await get("word-notes/")
    const data = await res.json()
    if (res.ok) return {
      status: "success",
      wordNotes: data
    }
    return {
      status: "failure",
      reason: data.error
    }
  } catch (e) {
    return unknownFailure
  }
}

type UpdateAPIWordNoteSuccess = {
  status: "success",
  updatedWordNote: APIWordNoteType
}
export const updateAPIWordNote = async (wordNote: APIWordNoteType): Promise<UpdateAPIWordNoteSuccess|Failure> => {
  try {
    const res = await put(`word-notes/${wordNote.uuid}/`, convertAPIWordNoteToPOSTable(wordNote))
    const data = await res.json()
    if (res.ok) return {
      status: "success",
      updatedWordNote: data
    }
    return {
      status: "failure",
      reason: data.error
    }
  } catch (e) {
    return unknownFailure
  }

}

type CreateAPIWordNoteSuccess = {
  status: "success",
  createdWordNote: APIWordNoteType
}
export const createAPIWordNote = async (wordNote: APIWordNoteType): Promise<CreateAPIWordNoteSuccess|Failure> => {
  try {
    const res = await post(`word-notes/`, convertAPIWordNoteToPOSTable(wordNote))
    const data = await res.json()
    if (res.ok) return {
      status: "success",
      createdWordNote: data
    }
    return {
      status: "failure",
      reason: data.error || data.errors
    }
  } catch (e) {
    return unknownFailure
  }
}

export const orderGeneration = () => {
  return post("word-notes/generate/", {})
}

export const deleteAPIWordNote = async (wordNote: APIWordNoteType): Promise<Success|Failure> => {
  try {
    const res = await delete_(`word-notes/${wordNote.uuid}/`)
    if (res.ok) return success
    const data = await res.json()
    return {status: "failure", reason: data.errors}
  } catch  {
    return unknownFailure
  }
}