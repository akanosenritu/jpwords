import React, {useState} from "react";
import {Box, Button, Card, Grid, IconButton, InputBase, Paper, Typography} from "@material-ui/core";
import {
  availableWordNotesByUUID,
  WordNote,
  wordNotesDataLastEditDate,
  WordNoteType
} from "../../data/WordNotes/WordNote";
import {availableWords, wordsDataLastEditDate, WordType} from "../../data/Word";
import {EditWordNoteDrawer} from "./EditWordNoteDrawer";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import {WordNotesTable} from "./WordNotesTable";
import {initialEditingWordNotesData, useEditingWordNotesData} from "../../data/Storage/EditingWordNotesData";
import {v4 as uuid4} from "uuid";

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
  const {editingWordNotesData, setEditingWordNotesData} = useEditingWordNotesData(initialEditingWordNotesData);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [wordNoteConcerning, setWordNoteConcerning] = useState<WordNoteType|null>(null);
  const createOrModifyWordNote = (wordNote: WordNoteType) => {
    const newWordNotesData = {...editingWordNotesData};
    newWordNotesData.wordNotes[wordNote.id] = wordNote;
    editingWordNotesData.lastEdit = new Date().toISOString();
    setEditingWordNotesData(newWordNotesData);
  };
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
  const reloadWordNotesData = () => {
    setEditingWordNotesData({
      wordNotes: availableWordNotesByUUID,
      lastEdit: new Date().toISOString(),
      wordNotesDataBasedOnLastEdit: wordNotesDataLastEditDate
    })
  };
  const onClickOpenEditor = (wordNote: WordNoteType) => {
    setWordNoteConcerning(wordNote);
    setIsDrawerOpen(true);
  }
  const onClickAddNewWordNote = () => {
    const blankWordNote: WordNoteType = {
      id: uuid4(),
      title: "",
      description: "",
      content: "",
      associatedCategories: [] as string[],
      associatedWords: [] as string[],
    }
    setWordNoteConcerning(blankWordNote);
    setIsDrawerOpen(true);
  };
  const formatWordNotesData = (wordNotesData: {[key: string]: WordNoteType}) => {
    return Object.values(wordNotesData).sort((A, B) => {
      if (A.title > B.title) return 1
      else if (A.title < B.title) return -1
      if (A.id > B.id) return 1
      else if (A.id < B.id) return -1
      return 0
    })
  }
  return <div className={classes.manageWordNotesView}>
    <Grid container>
      <Grid item xs={4}>
        <Box className={classes.toolButtonsContainer}>
          <Button variant={"outlined"} color={"primary"} onClick={downloadWordNotesData}>Download</Button>
          <Button variant={"outlined"} color={"secondary"} onClick={reloadWordNotesData}>Reload</Button>
          {editingWordNotesData.wordNotesDataBasedOnLastEdit !== wordNotesDataLastEditDate && <Typography variant={"body2"} display={"inline"} color={"secondary"}>
            The data basing on has been changed.
          </Typography>}
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
      <WordNotesTable wordNotes={formatWordNotesData(editingWordNotesData.wordNotes)} onClickOpenEditor={onClickOpenEditor}/>
      {wordNoteConcerning && <EditWordNoteDrawer
        key={wordNoteConcerning.id} isOpen={isDrawerOpen} onClose={()=>{setIsDrawerOpen(false);}}
        wordNote={wordNoteConcerning} createOrModifyWordNote={createOrModifyWordNote}
      />}
    </Box>
  </div>
}