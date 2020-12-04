import React from "react";

type RubyProps = {
  b?: string,
  t: string
}

export const Ruby: React.FC<RubyProps> = props => {
  return <ruby>
    {props.b? props.b: props.children} <rp>(</rp><rt>{props.t}</rt><rp>)</rp>
  </ruby>
}