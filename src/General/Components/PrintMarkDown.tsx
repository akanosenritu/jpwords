import ReactMarkDown from "react-markdown";
import React from "react";
import gfm from "remark-gfm";

type PrintMarkDownProps = {
  content: string
}

export const PrintMarkDown: React.FC<PrintMarkDownProps> = props => {
  return <ReactMarkDown plugins={[gfm]} skipHtml={true}>{props.content}</ReactMarkDown>
}