import {get, post, put} from "./API";

export type APICategoryType = {
  uuid: string,
  name: string,
  description: string
}

export const retrieveAPICategories = () => {
  return get("categories/")
    .then(res => res.json())
    .then(data => data as APICategoryType[])
}

export const updateAPICategory = (category: APICategoryType) => {
  return put(`categories/${category.uuid}/`, category)
    .then(res => res.json())
    .then(data => data as APICategoryType)
}

export const createAPICategory = (category: APICategoryType) => {
  return post(`categories/`, category)
    .then(res => res.json())
    .then(data => data as APICategoryType)
}
