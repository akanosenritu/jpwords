import {login, logout} from "../API/API";

type Status = "Anonymous" | "LoggingIn" | "User" | "Staff"

export class User {
  status: Status
  userName: string
  constructor() {
    this.status = "Anonymous"
    this.userName = ""
  }
  logIn(userName_: string, password: string) {
    this.status = "LoggingIn"
    return login(userName_, password)
      .then(() => {
        this.userName = userName_
        this.status = "User"
      })
      .catch(err => {
        this.status = "Anonymous"
        console.log(err)
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
  }
}

export const user = new User()