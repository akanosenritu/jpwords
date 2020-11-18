export type UserPreference = {
  wordNotesHiddenStatus: {
    [wordNoteId: string]: boolean
  }
}

export const createUserPreference = () => {
  return {
    wordNotesHiddenStatus: {}
  } as UserPreference
}

export const loadUserPreference = (): UserPreference => {
  let storage = localStorage.getItem("userPreference");
  let data;
  if (!storage) {
    data = createUserPreference();
    localStorage.setItem("userPreference", JSON.stringify(data));
  } else {
    data = JSON.parse(storage) as UserPreference;
  }
  return data
}

export const saveUserPreference = (wordNoteConfig: UserPreference) => {
  localStorage.setItem("userPreference", JSON.stringify(wordNoteConfig));
}
