import {get, post, put} from "./API";

export type APIWordNoteType = {
  uuid: string,
  associatedWords: string[]
  associatedCategories: string[],
  title: string,
  is_published: boolean
}

export const retrieveAPIWordNotes = () => {
  return get("word-notes/")
    .then(res => res.json())
    .then(data => {
      return data as APIWordNoteType[]
    })
}

export const updateAPIWordNote = (wordNote: APIWordNoteType) => {
  return put(`word-notes/${wordNote.uuid}/`, wordNote)
    .then(res => res.json())
    .then(data => {
      return data as APIWordNoteType
    })
}

export const createAPIWordNote = (wordNote: APIWordNoteType) => {
  return post(`word-notes/`, wordNote)
    .then(res => res.json())
    .then(data => {
      return data as APIWordNoteType
    })
}