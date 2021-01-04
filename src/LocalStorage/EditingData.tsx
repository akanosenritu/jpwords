import {Failure} from "../API/API";

type GetEditingDataSuccess = {
  status: "success",
  data: string
}

export const getEditingData = (identifier: string): GetEditingDataSuccess|Failure => {
  const data = localStorage.getItem(identifier)
  if (!data) return {status: "failure", reason: "not found"}
  return {status: "success", data}
}

export const setEditingData = (identifier: string, data: string) => {
  localStorage.setItem(identifier, data)
}