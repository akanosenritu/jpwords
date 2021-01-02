import React, {useEffect, useState} from "react";
import {Box, Button, Grid, IconButton, InputBase, Paper} from "@material-ui/core";
import {
  WordNoteType
} from "../../data/WordNotes/WordNote";
import {EditWordNoteDrawer} from "./EditWordNoteDrawer";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import {WordNotesTable} from "./WordNotesTable";
import {
  APIWordNoteType,
  createAPIWordNote,
  retrieveAPIWordNotes,
  updateAPIWordNote,
  useAPIWordNotes
} from "../../API/APIWordNote";
import {APIWordNotesProvider} from "../../API/APIWordNoteProvider";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    manageWordNotesView: {
      width: "98%",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: 20,
      boxSizing: "border-box"
    },
    searchBox: {
      display: "flex",
      alignItems: "center",
      width: 400
    },
    searchBoxInput: {
      marginLeft: theme.spacing(1)
    },
    toolButtonsContainer: {
      "& .MuiButtonBase-root": {
        margin: theme.spacing(1)
      }
    }
  })
)


type DisplayWordNoteProps = {
  wordNote: WordNoteType,
  onClick: (wordNote: WordNoteType) => void,
}

const SearchBox: React.FC = () => {
  const classes = useStyles();
  return <Paper component={"form"} className={classes.searchBox}>
    <InputBase color={"primary"} fullWidth={true} className={classes.searchBoxInput} placeholder={"Search word notes"} disabled={true}/>
    <IconButton disabled>
      <SearchIcon />
    </IconButton>
  </Paper>
}

export const ManageWordNotesView: React.FC = () => {
  const classes = useStyles();
  return <div className={classes.manageWordNotesView}>
    <Box mt={2} style={{maxHeight: "100%"}}>
      <APIWordNotesProvider>
        <WordNotesTable />
      </APIWordNotesProvider>
    </Box>
  </div>
}