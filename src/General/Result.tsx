export type Success = {
  status: "success"
}

export type SuccessWithData<T> = {
  status: "success"
  data: T
}

export type Failure = {
  status: "failure",
  reason: string
}

export const unknownFailure: Failure = {
  status: "failure",
  reason: "unknown error"
}
export const defaultValueFailure: Failure = {
  status: "failure",
  reason: "default value"
}