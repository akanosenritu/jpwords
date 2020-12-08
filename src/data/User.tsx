import {isLoggedIn, login, logout} from "../API/API";
import {getUserData, initialUserData, setUserData} from "./Storage/userDataStorage";

type Status = "Anonymous" | "LoggingIn" | "LoggedIn"

export class User {
  username: string | null
  status: Status
  constructor() {
    const userData = getUserData(initialUserData)
    this.username = userData.username
    this.status = this.username? "LoggedIn": "Anonymous"
  }
  logIn(userName_: string, password: string) {
    this.status = "LoggingIn"
    return login(userName_, password)
      .then(() => {
        this.username = userName_
        this.status = "LoggedIn"
        setUserData({
          username: userName_
        })
      })
      .catch(err => {
        this.status = "Anonymous"
        throw err
      })
  }
  isLoggedIn() {
    return this.status === "LoggedIn"
  }
  logOut() {
    logout()
      .then(() => {
        this.status = "Anonymous"
        this.username = null
        setUserData(initialUserData)
      })
      .catch(err => {
        console.log(err)
      })
  }
}

export const user = new User()