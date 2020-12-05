// const serverURL = "http://localhost:8020/"
const serverURL = "https://enigmatic-crag-66978.herokuapp.com/"
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

export const login = (username: string, password: string) => {
  const formData = new FormData()
  formData.append("username", username)
  formData.append("password", password)
  return myFetch(serverURL+"dj-rest-auth/login/", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (!data.key) throw data
      token = data.key
    })
}