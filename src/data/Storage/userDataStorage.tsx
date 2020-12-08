const STORAGE_NAME = "userData"

export type UserData = {
  username: string | null,
}

export const initialUserData: UserData = {
  username: null
}

export const setUserData = (userData: UserData) => {
  window.localStorage.setItem(STORAGE_NAME, JSON.stringify(userData))
}

export const getUserData = (initialUserData: UserData): UserData => {
  const userData = window.localStorage.getItem(STORAGE_NAME)
  return userData? JSON.parse(userData): initialUserData
}