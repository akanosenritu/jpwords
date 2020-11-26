import {WordType} from "../../data/Word";
import React from "react";
import {DrawerBase} from "../DrawerBase";
import {Box, List, ListItem, ListItemText, Paper, TableBody, Typography} from "@material-ui/core";
import {searchWordInAvailableWordLists} from "../../data/WordList";
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import {getWordHistory} from "../../data/Storage/PracticeHistory";

type InspectorProps = {
  word: WordType
}

const Inspector: React.FC<InspectorProps> = (props) => {
  const wordPracticeHistory = getWordHistory(props.word);
  return <Box>
    <Box style={{borderLeft: "5px solid lightgray", paddingLeft: 10}} ml={1}>
      <Typography variant={"h6"}>Word lists using this word</Typography>
    </Box>
    <List>
      {searchWordInAvailableWordLists(props.word).map(wordList => {
        return <ListItem button>
          <ListItemText>
            <Typography variant={"body1"} display={"inline"}>{wordList.name}</Typography>:
            <Typography variant={"body2"} display={"inline"}> {wordList.description}</Typography>
          </ListItemText>
        </ListItem>
      })}
    </List>
    <Box style={{borderLeft: "5px solid lightgray", paddingLeft: 10}} ml={1}>
      <Typography variant={"h6"}>Word Practice History</Typography>
    </Box>
    {wordPracticeHistory ? <Box mt={1} ml={2}><TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Number of practices</TableCell>
            <TableCell>{wordPracticeHistory.nPractices}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Strength</TableCell>
            <TableCell>{wordPracticeHistory.strength}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Next practice date</TableCell>
            <TableCell>{wordPracticeHistory.nextPracticeDate}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer></Box>: <Box mt={1} ml={2}><Typography>No practice history.</Typography></Box>
    }
  </Box>
}

type InspectWordDrawerProps = {
  onClose: () => void,
  isOpen: boolean,
  word: WordType,
}

export const InspectWordDrawer: React.FC<InspectWordDrawerProps> = props => {
  return <DrawerBase isOpen={props.isOpen} onClose={props.onClose} inside={<Inspector word={props.word} />} />
}
