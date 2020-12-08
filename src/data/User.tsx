import React, {useEffect, useState} from "react";
import {getUserData, initialUserData, setUserData} from "./Storage/userDataStorage";
import * as api from "../API/APIUser"

export type AnonymousUser = {
  status: "Anonymous"
}
export type AuthenticatedUser = {
  status: "Authenticated",
  username: string,
}

export type User = AnonymousUser | AuthenticatedUser

type UserContextValue = {
  user: User,
  login: (username: string, password: string) => Promise<api.LoginResult>,
  logout: () => Promise<api.LogoutResult>,
  signUp: (username: string, password1: string, password2: string) => Promise<api.SignUpResult>
}

const defaultUserContextValue = {
  user: {status: "Anonymous"} as AnonymousUser,
  login: async (username: string, password:string) => {
    return {
      status: "failure",
      reason: "(initial value)"
    } as api.LoginResult
  },
  logout: async () => {
    return {
      status: "failure",
      reason: "(initial value)"
    } as api.LogoutResult
  },
  signUp: async (username: string, password1: string, password2: string) => {
    return {
      status: "failure",
      reason: "(initial value)"
    } as api.SignUpResult
  }
}

export const UserContext = React.createContext<UserContextValue>(defaultUserContextValue)

export const UserProvider: React.FC = (props) => {
  const [user, setUser] = useState<User>({status: "Anonymous"})
  useEffect(() => {
    api.isLoggedIn()
      .then(bool => {
        if (bool) {
          setUser({
            status: "Authenticated",
            username: getUserData(initialUserData).username
          })
        }})
  }, [])
  const login = async (username: string, password: string) => {
    return api.login(username, password)
      .then(result => {
        if (result.status === "success") {
          setUser({
            status: "Authenticated",
            username: username
          })
          setUserData({username: username})
        }
        return result
      })
  }
  const logout = async () => {
    return api.logout()
      .then(result => {
        setUser({
          status: "Anonymous"
        })
        setUserData(initialUserData)
        return result
      })
  }
  const signUp = async (username: string, password1: string, password2: string) => {
    return api.signUp(username, password1, password2)
      .then(result => {
        if (result.status === "success"){
          setUser({
            status: "Authenticated",
            username: username
          })
          setUserData({username: username})
        }
        return result
      })
  }
  return <UserContext.Provider value={{user, login, logout, signUp}}>
    {props.children}
  </UserContext.Provider>
}