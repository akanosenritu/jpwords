import createPersistedState from 'use-persisted-state';
import {availableWordNotesByUUID, wordNotesDataLastEditDate, WordNoteType} from "../WordNotes/WordNote";
const useEditingWordNotesDataState = createPersistedState('editingWordNotesData');

type EditingWordNotesData = {
  wordNotes: {[key: string]: WordNoteType},
  lastEdit: string,
  wordNotesDataBasedOnLastEdit: string
}

export const initialEditingWordNotesData: EditingWordNotesData = {
  wordNotes: availableWordNotesByUUID,
  lastEdit: new Date().toISOString(),
  wordNotesDataBasedOnLastEdit: wordNotesDataLastEditDate
}

export const useEditingWordNotesData = (initialEditingWordNotesData: EditingWordNotesData) => {
  const [editingWordNotesData, setEditingWordsData] = useEditingWordNotesDataState(initialEditingWordNotesData);
  return {
    editingWordNotesData,
    setEditingWordNotesData: (newEditingWordNotesData: EditingWordNotesData) => setEditingWordsData(newEditingWordNotesData)
  }
}