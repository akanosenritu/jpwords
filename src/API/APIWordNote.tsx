import {Failure, get, post, put, unknownError} from "./API";
import {useEffect, useState} from "react";
import {APIWordType} from "./APIWord";

export type APIWordNoteType = {
  uuid: string,
  associated_words: string[]
  associated_categories: string[],
  title: string,
  is_published: boolean,
  content: string,
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
    return {
      status: "failure",
      reason: "unknown reason"
    }
  }
}

type UpdateAPIWordNoteSuccess = {
  status: "success",
  updatedWordNote: APIWordNoteType
}
export const updateAPIWordNote = async (wordNote: APIWordNoteType): Promise<UpdateAPIWordNoteSuccess|Failure> => {
  try {
    const res = await put(`word-notes/${wordNote.uuid}/`, wordNote)
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
    return unknownError
  }

}

type CreateAPIWordNoteSuccess = {
  status: "success",
  createdWordNote: APIWordNoteType
}
export const createAPIWordNote = async (wordNote: APIWordNoteType): Promise<CreateAPIWordNoteSuccess|Failure> => {
  try {
    const res = await post(`word-notes/`, wordNote)
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
    return unknownError
  }
}

export const useAPIWordNotes = () => {
  const [wordNotes, setWordNotes] = useState<APIWordNoteType[]>([])
  const getWordNotes = (word: APIWordType) => {
    return wordNotes.filter(wordNote => {
      for (const wordUUID of wordNote.associated_words) {
        if (wordUUID === word.uuid) return true
      }
      for (const categoryUUID of wordNote.associated_categories) {
        for (const categoryUUID_ of word.category) {
          if (categoryUUID === categoryUUID_) return true
        }
      }
      return false
    })
  }
  const loadWordNotesData = async () => {
    const result = await retrieveAPIWordNotes()
    if (result.status === "success") {
      setWordNotes(result.wordNotes)
    }
  }
  useEffect(()=>{
    loadWordNotesData()
  }, [])
  return {wordNotes, getWordNotes}
}