import React, {useEffect, useState} from "react";
import {getUserData, initialUserData, setUserData} from "../LocalStorage/userDataStorage";
import * as api from "../API/APIUser"
import {ResetPasswordResult} from "../API/APIUser";

export type AnonymousUser = {
  status: "Anonymous"
}
export type AuthenticatedUser = {
  status: "Authenticated",
  username: string,
}
export type AdminUser = {
  status: "Admin",
  username: string
}
export type StaffUser = {
  status: "Staff",
  username: string
}

export type User = AnonymousUser | AuthenticatedUser | AdminUser | StaffUser

type UserContextValue = {
  user: User,
  login: (username: string, password: string) => Promise<api.LoginResult>,
  logout: () => Promise<api.LogoutResult>,
  signUp: (username: string, password1: string, password2: string) => Promise<api.SignUpResult>,
  resetPassword: (username: string, oldPassword: string, newPassword1: string, newPassword2: string) => Promise<api.ResetPasswordResult>
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
  },
  resetPassword: async (username: string, oldPassword: string, newPassword1: string, newPassword2: string) => {
    return {
      status: "failure",
      reason: "(initial value)"
    } as ResetPasswordResult
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
      .catch(err => {
        setUser({
          status: "Anonymous"
        })
        setUserData(initialUserData)
        console.log(err)
        return {
          status: "failure",
          reason: "unknown reason",
        } as api.LogoutResult
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
  const resetPassword = async (username: string, oldPassword: string, newPassword1: string, newPassword2: string) => {
    return api.resetPassword(username, oldPassword, newPassword1, newPassword2)
      .then(result => {
        return result
      })
  }
  return <UserContext.Provider value={{user, login, logout, signUp, resetPassword}}>
    {props.children}
  </UserContext.Provider>
}