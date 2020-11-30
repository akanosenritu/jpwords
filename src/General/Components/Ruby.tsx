import React from "react";

type RubyProps = {
  b: string,
  t: string
}

export const Ruby: React.FC<RubyProps> = props => {
  return <ruby>
    {props.b} <rp>(</rp><rt>{props.t}</rt><rp>)</rp>
  </ruby>
}