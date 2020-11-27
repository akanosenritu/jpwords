export type Language = "ENG" | "ESP"

export const isLanguage = (value: any): value is Language  => {
  if (typeof value !== "string") return false
  if (value === "ENG") return true
  else if (value === "ESP") return true
  return false
}