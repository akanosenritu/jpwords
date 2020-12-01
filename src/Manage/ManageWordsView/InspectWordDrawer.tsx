import React from "react";
import {DrawerBase} from "../DrawerBase";
import {Box, List, Typography} from "@material-ui/core";
import {APIWordType} from "../API/APIWord";

type InspectorProps = {
  word: APIWordType
}

const Inspector: React.FC<InspectorProps> = (props) => {
  return <Box>
    <Box style={{borderLeft: "5px solid lightgray", paddingLeft: 10}} ml={1}>
      <Typography variant={"h6"}>Word lists using this word</Typography>
    </Box>
    <List>
      <p>TO BE IMPLEMENTED</p>
    </List>
    <Box style={{borderLeft: "5px solid lightgray", paddingLeft: 10}} ml={1}>
      <Typography variant={"h6"}>Word Practice History</Typography>
    </Box>
  </Box>
}

type InspectWordDrawerProps = {
  onClose: () => void,
  isOpen: boolean,
  word: APIWordType,
}

export const InspectWordDrawer: React.FC<InspectWordDrawerProps> = props => {
  return <DrawerBase isOpen={props.isOpen} onClose={props.onClose} inside={<Inspector word={props.word} />} />
}
