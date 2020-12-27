import React, {useContext} from "react";
import {HiddenContext} from "../../GrammarView/HiddenContext";

export const Hide: React.FC = props => {
  const hidden = useContext(HiddenContext)
  let shown: string|React.ReactElement = "UNAVAILABLE"
  if (typeof props.children === "string") {
    shown = hidden?
      `(${new Array(props.children.length).fill("　").join("")})`:
      <span style={{color: "#33cc33"}}><b>{props.children}</b></span>
  } else {
    shown = hidden?
      `(　　　)`:
      <span style={{color: "#33cc33"}}><b>{props.children}</b></span>
  }
  return <>
    {shown}
  </>
}