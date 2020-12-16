import React from "react";

export const Paragraph: React.FC = props => {
  return <div style={{paddingLeft: 10, paddingTop:20}}>
    {props.children}
  </div>
}