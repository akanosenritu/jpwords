import React, {useEffect, useState} from "react";
import {Box, Button, Grid, IconButton, InputBase, Paper} from "@material-ui/core";
import {
  WordNoteType
} from "../../data/WordNotes/WordNote";
import {EditWordNoteDrawer} from "./EditWordNoteDrawer";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import {WordNotesTable} from "./WordNotesTable";
import {APIWordNoteType, createAPIWordNote, retrieveAPIWordNotes, updateAPIWordNote} from "../API/APIWordNote";

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
  const [wordNotesData, setWordNotesData] = useState<APIWordNoteType[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [wordNoteConcerning, setWordNoteConcerning] = useState<APIWordNoteType|null>(null);
  const createOrModifyWordNote = (wordNote: APIWordNoteType) => {
    if (wordNote.uuid === "") {
      createAPIWordNote(wordNote)
        .then(data => {
          console.log(`Creation of a new word note succeeded.`)
          loadWordNotes()
        })
        .catch(err => console.log(`Creation of a new word note failed.`, err))
    } else {
      updateAPIWordNote(wordNote)
        .then(data => {
          console.log(`Update of a new word note succeeded.`)
          loadWordNotes()
        })
        .catch(err => console.log(`Update of a word note failed.`, err))
    }
  };
  const loadWordNotes = () => {
    retrieveAPIWordNotes()
      .then(data => setWordNotesData(data))
      .catch(err => console.log(`The retrieval of word notes failed.`, err))
  }
  useEffect(() => {
    loadWordNotes()
    }, [])
  /**
  const downloadWordNotesData = () => {
    const wordNotes = formatWordNotesData(editingWordNotesData.wordNotes);
    const data = {
      lastEdit: new Date().toISOString(),
      wordNotes: wordNotes
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
    const aElement = document.createElement("a");
    aElement.download = "wordNotes.json";
    aElement.href = window.URL.createObjectURL(blob);
    aElement.click()
    aElement.remove()
  };
   **/
  const onClickOpenEditor = (wordNote: APIWordNoteType) => {
    setWordNoteConcerning(wordNote);
    setIsDrawerOpen(true);
  }
  const onClickAddNewWordNote = () => {
    const blankWordNote: APIWordNoteType = {
      uuid: "",
      title: "",
      associatedCategories: [] as string[],
      associatedWords: [] as string[],
      is_published: false
    }
    setWordNoteConcerning(blankWordNote);
    setIsDrawerOpen(true);
  };
  return <div className={classes.manageWordNotesView}>
    <Grid container>
      <Grid item xs={4}>
        <Box className={classes.toolButtonsContainer}>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box display={"flex"} justifyContent={"center"}>
          <SearchBox />
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box display={"flex"} justifyContent={"center"}>
          <Button variant={"outlined"} onClick={onClickAddNewWordNote}>Add new word note</Button>
        </Box>
      </Grid>
    </Grid>
    <Box mt={2} style={{maxHeight: "100%"}}>
      <WordNotesTable wordNotes={wordNotesData} onClickOpenEditor={onClickOpenEditor}/>
      {wordNoteConcerning && <EditWordNoteDrawer
        key={wordNoteConcerning.uuid} isOpen={isDrawerOpen} onClose={()=>{setIsDrawerOpen(false);}}
        wordNote={wordNoteConcerning} createOrModifyWordNote={createOrModifyWordNote}
      />}
    </Box>
  </div>
}