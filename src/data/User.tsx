import {login, logout} from "../API/API";

type Status = "Anonymous" | "LoggingIn" | "User" | "Staff"

export class User {
  status: Status
  userName: string
  token: string | null
  constructor() {
    this.status = "Anonymous"
    this.userName = ""
    this.token = null
  }
  logIn(userName_: string, password: string) {
    this.status = "LoggingIn"
    return login(userName_, password)
      .then(token => {
        this.userName = userName_
        this.token = token
        this.status = "User"
      })
      .catch(err => {
        this.status = "Anonymous"
        throw err
      })
  }
  isLoggedIn() {
    return this.status === "User" || this.status === "Staff"
  }
  logOut() {
    logout()
      .catch(err => {
        console.log(err)
      })
    this.status = "Anonymous"
    this.userName = ""
    this.token = null
  }
}

export const user = new User()