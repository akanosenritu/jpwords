import Cookies from "js-cookie";
export let token: null|string = null

const myFetch = (input: RequestInfo, init?: RequestInit) => {
  return fetch(input, init)
    .then(res => {
      if (!res.ok) throw new Error(`Fetch failed. Status: ${res.status}, Status Text: ${res.statusText}`)
      return res
    })
}

export const get = (url: string, params?: Map<string, string>) => {
  let actualURL = new URL("/api/" + url, window.location.origin);
  if (params) {
    params.forEach((value, key) => {
      actualURL.searchParams.append(key, value)
    })
  }
  return myFetch(actualURL.toString());
}

export const post = async (url: string, data: object) => {
  const csrfToken = await getCsrfToken()
  return myFetch("/api/"+url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken
    },
    body: JSON.stringify(data)
  })
}

export const put = (url: string, data: object) => {
  return myFetch("/api/" + url, {
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

export const getCsrfToken = async (): Promise<string> => {
  const csrfToken = Cookies.get("csrftoken")
  if (csrfToken) return csrfToken
  return setCsrfToken()
}







