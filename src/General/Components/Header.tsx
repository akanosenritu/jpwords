import React from "react";
import {Box, Typography} from "@material-ui/core";

type HeaderProps = {
  content: string
}

export const Header: React.FC<HeaderProps> = props => {
  return <Box style={{borderLeft: "5px solid lightgray", paddingLeft: 10}}>
    <Typography variant={"h6"}>{props.content}</Typography>
  </Box>
}