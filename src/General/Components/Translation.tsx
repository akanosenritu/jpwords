import React from "react";
import {initialConfigurations, useConfigurations} from "../../LocalStorage/Configurations";

type Props = {
  language: string,
  children: any
}
export const Translation: React.FC<Props> = props => {
  const {configurations} = useConfigurations(initialConfigurations)
  if (configurations.language === props.language) return props.children
  return <></>
}