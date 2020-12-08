// const serverURL = "http://localhost:8020/"
import Cookies from "js-cookie";

const serverURL = "https://shrouded-thicket-03801.herokuapp.com/"
const apiURL = serverURL + "api/"
export let token: null|string = null

const myFetch = (input: RequestInfo, init?: RequestInit) => {
  return fetch(input, init)
    .then(res => {
      if (!res.ok) throw new Error(`Fetch failed. Status: ${res.status}, Status Text: ${res.statusText}`)
      return res
    })
}

export const get = (url: string, params?: Map<string, string>) => {
  let actualURL = new URL(apiURL+url);
  if (params) {
    params.forEach((value, key) => {
      actualURL.searchParams.append(key, value)
    })
  }
  return myFetch(actualURL.toString());
}

export const post = (url: string, data: object) => {
  return myFetch(apiURL+url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
}

export const postWithToken = (url: string, data: object, token: string) => {
  return myFetch(apiURL+url, {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
}

export const put = (url: string, data: object) => {
  return myFetch(apiURL + url, {
    method: "PUT",
    headers:{
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
}

export const setCsrfToken = async (): Promise<string> => {
  return fetch("/api/set-csrf-token/")
    .then(res => res.json())
    .then(data => {
      return Cookies.get("csrftoken") as string
    })
}

export const login = async (username: string, password: string) => {
  const headers = new Headers()
  const csrfToken = await setCsrfToken()
  headers.append("X-CSRFToken", csrfToken)
  headers.append("Content-Type", "application/json")
  return myFetch('/api/login/', {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)
    })
}

export const logout = async () => {
  const headers = new Headers()
  const csrfToken = await setCsrfToken()
  headers.append("X-CSRFToken", csrfToken)
  return myFetch('/api/logout/', {
    method: "POST",
    headers: headers
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)
    })
}