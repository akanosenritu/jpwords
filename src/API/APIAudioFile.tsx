import {Failure, get, post, Success} from "./API";

export type APIAudioFile = {
  uuid: string,
  associated_words: string[],
  created_by: string,
  created_at: string,
  url: string,
  text: string
}

type GetAudioForWordSuccess = {
  status: "success",
  audioFile: APIAudioFile
}
type GetAudioForWordResult = GetAudioForWordSuccess | Failure

export const getAudioForWord = (wordUUID: string): Promise<GetAudioForWordResult> => {
  return get("/get-audio-for-word/", new Map<string, string>([["wordUUID", wordUUID]]))
    .then(res => {
      if (res.ok) return res.json()
        .then(data => {
          if (data.audioFile !== undefined) return {status: "success", audioFile: data.audioFile} as GetAudioForWordSuccess
          return {status: "failure", reason: data.error} as Failure
        })
      return {status: "failure", reason: "unknown reason"} as Failure
    })
    .catch(err => {
      return {status: "failure", reason: "unknown reason"} as Failure
    })
}

type CreateAudioSuccess = {
  status: "success",
  audioFile: APIAudioFile
}

export const createAudio = (text: string, wordUUID: string): Promise<CreateAudioSuccess|Failure> => {
  return post("/audio/", {
    text: text,
    associated_words: [wordUUID]
  })
    .then(res => {
      if (res.ok) return res.json()
        .then(data => {
          if (data.audioFile) return {status: "success", audioFile: data.audioFile} as CreateAudioSuccess
          return {status: "failure", reason: data.error} as Failure
        })
      return {status: "failure", reason: "unknown reason"} as Failure
    })
    .catch(err => {
      return {status: "failure", reason: "unknown reason"} as Failure
    })
}