import React, {useEffect, useState} from "react";
import {APIWordNoteType, createAPIWordNote, retrieveAPIWordNotes, updateAPIWordNote} from "./APIWordNote";
import {APIWordType} from "./APIWord";
import {defaultValueError, Failure, success, Success} from "./API";

type APIWordNotesContextValue = {
  wordNotes: APIWordNoteType[],
  getWordNotes: (word: APIWordType) => APIWordNoteType[],
  createWordNote: (wordNote: APIWordNoteType) => Promise<Success|Failure>
  updateWordNote: (wordNote: APIWordNoteType) => Promise<Success|Failure>
}
const defaultAPIWordNotesContextValue: APIWordNotesContextValue = {
  wordNotes: [],
  getWordNotes: () => [],
  createWordNote: () => new Promise(((resolve, reject) => reject(defaultValueError))),
  updateWordNote: () => new Promise(((resolve, reject) => reject(defaultValueError)))
}

export const APIWordNotesContext = React.createContext(defaultAPIWordNotesContextValue)

export const APIWordNotesProvider: React.FC = props => {
  const [wordNotes, setWordNotes] = useState<APIWordNoteType[]>([])
  const loadWordNotesData = async () => {
    const result = await retrieveAPIWordNotes()
    if (result.status === "success") {
      setWordNotes(result.wordNotes)
    }
  }
  useEffect(()=>{
    loadWordNotesData()
  }, [])

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

  const createWordNote = async (wordNote: APIWordNoteType): Promise<Success|Failure> => {
    const result = await createAPIWordNote(wordNote)
    if (result.status === "success") {
      loadWordNotesData()
    }
    return result
  }

  const updateWordNote = async (wordNote: APIWordNoteType): Promise<Success|Failure> => {
    const result = await updateAPIWordNote(wordNote)
    if (result.status === "success") {
      const index = wordNotes.findIndex(wordNote => wordNote.uuid === result.updatedWordNote.uuid)
      if (index === -1) loadWordNotesData()
      const newWordNotes = [...wordNotes]
      newWordNotes[index] = result.updatedWordNote
      setWordNotes(newWordNotes)
      return success
    } else {
      loadWordNotesData()
      return result
    }
  }

  return <APIWordNotesContext.Provider value={{wordNotes, getWordNotes, createWordNote, updateWordNote}}>
    {props.children}
  </APIWordNotesContext.Provider>
}