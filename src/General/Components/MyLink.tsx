import {useHistory} from "react-router-dom";
import React from "react";

type MyLinkProps = {
  to: string
}
export const MyLink: React.FC<MyLinkProps> = (props) => {
  const history = useHistory();
  const onClick = () => {
    history.push(props.to)
  };
  return <span onClick={onClick} style={{cursor: "pointer"}}>{props.children}</span>
};