import React from "react";

export const Paragraph: React.FC = props => {
  return <div style={{padding: 15}}>
    {props.children}
  </div>
}