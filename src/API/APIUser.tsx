import {getCsrfToken, Success, Failure} from "./API";


export type SignUpResult = Success | Failure

export const signUp = async (username: string, password1: string, password2: string): Promise<SignUpResult> => {
  const headers = new Headers()
  const csrfToken = await getCsrfToken()
  headers.append("X-CSRFToken", csrfToken)
  return fetch('/api/registration/', {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      username: username,
      password1: password1,
      password2: password2
    })
  })
    .then(res => {
      return res.json().then(data => {
        if (res.ok) return {
          status: "success"
        } as Success
        return {
          "status": "failure",
          "reason": data["error"]
        } as Failure
      })
    })
    .catch(() => {
      return {
        status: "failure",
        reason: "unknown reason"
      } as Failure
    })
}


type LoginSuccess = {
  status: "success",
  isAdmin: boolean,
  isStaff: boolean
}

export type LoginResult = LoginSuccess | Failure

export const login = async (username: string, password: string): Promise<LoginResult> => {
  const headers = new Headers()
  const csrfToken = await getCsrfToken()
  headers.append("X-CSRFToken", csrfToken)
  headers.append("Content-Type", "application/json")
  return fetch('/api/login/', {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
    .then(res => {
      if (res.ok) return res.json()
        .then(data => {
          if (data.detail === "success") return  {status: "success", isStaff: !!data.isStaff, isAdmin: !!data.isAdmin} as LoginSuccess
          return {status: "failure", reason: data.error} as Failure
        })
      return {status: "failure", reason: "unknown reason"} as Failure
    })
    .catch(() => {
        return {status: "failure", reason: "unknown reason"} as Failure
    })
}


export const isLoggedIn = async (): Promise<boolean> => {
  return fetch("/api/check-login/")
    .then(res => {
      return res.status === 200
    })
}


export type LogoutResult = Success | Failure

export const logout = async (): Promise<LogoutResult> => {
  const headers = new Headers()
  const csrfToken = await getCsrfToken()
  headers.append("X-CSRFToken", csrfToken)
  return fetch('/api/logout/', {
    method: "POST",
    headers: headers
  })
    .then(res => {
      return res.json().then(data => {
        if (res.ok) return {status: "success"} as Success
        return {status: "failure", reason: "unknown reason"} as Failure
      })
      })
    .catch(err => {
      return {
        status: "failure",
        reason: "unknown reason"
      } as Failure
    })
}


export type ResetPasswordResult = Success | Failure

export const resetPassword = async (username: string, oldPassword: string, newPassword1: string, newPassword2: string): Promise<ResetPasswordResult> => {
  const headers = new Headers()
  const csrfToken = await getCsrfToken()
  headers.append("X-CSRFToken", csrfToken)
  headers.append("Content-Type", "application/json")
  const body = {
    username: username,
    oldPassword: oldPassword,
    newPassword1: newPassword1,
    newPassword2: newPassword2
  }
  return fetch("/api/reset-password/", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  })
    .then(res => {
      return res.json().then(data => {
        if (res.ok) return {status: "success"} as Success
        return {
          status: "failure",
          reason: data["error"]
        } as Failure
      })
    })
    .catch(err => {
      return {
        status: "failure",
        reason: "unknown reason"
      } as Failure
    })
}