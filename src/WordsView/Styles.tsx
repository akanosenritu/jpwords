type Status = "CORRECT" | "WRONG" | "COLOR A" | ""
type GetColorsResult = {
  backGround: string,
  main: string
}

export const getColors = (status: Status): GetColorsResult => {
  switch (status) {
    case "CORRECT":
      return {
        backGround: "#e9fce9",
        main: "#91ee91",
      }
    case "WRONG":
      return {
        backGround: "#fffaf2",
        main: "#ffd899"
      }
    case "COLOR A":
      return {
        backGround: "#99ffff",
        main: "#ccffff"
      }
    default:
      return {
        backGround: "",
        main: ""
      }
  }
}
