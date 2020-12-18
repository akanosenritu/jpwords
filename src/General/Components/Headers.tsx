import React from "react";
import {Box, Typography} from "@material-ui/core";

export const H5: React.FC = props => {
  return <Box style={{borderLeft: "5px solid lightgray", paddingLeft: 10}}>
    <Typography variant={"h5"}>{props.children}</Typography>
  </Box>
}

export const H6: React.FC = props => {
  return <Box style={{borderLeft: "3px solid lightgray", paddingLeft: 2}}>
    <Box style={{borderLeft: "3px solid lightgray", paddingLeft: 7}}>
      <Typography variant={"h6"}>{props.children}</Typography>
    </Box>
  </Box>
}