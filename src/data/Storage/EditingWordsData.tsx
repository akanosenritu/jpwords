import createPersistedState from 'use-persisted-state';
import {availableWords, wordsDataLastEditDate, WordType} from "../Word/Word";
const useEditingWordsDataState = createPersistedState('editingWordsData');

type EditingWordsData = {
  words: {[wordUUID: string]: WordType},
  lastEdit: string,
  wordsDataBasedOnLastEdit: string
}

export const initialEditingWordsData: EditingWordsData = {
  words: availableWords,
  lastEdit: new Date().toISOString(),
  wordsDataBasedOnLastEdit: wordsDataLastEditDate
}

export const useEditingWordsData = (initialEditingWordsData: EditingWordsData) => {
  const [editingWordsData, setEditingWordsData] = useEditingWordsDataState(initialEditingWordsData);
  return {
    editingWordsData,
    setEditingWordsData: (newEditingWordsData: EditingWordsData) => setEditingWordsData(newEditingWordsData)
  }
}