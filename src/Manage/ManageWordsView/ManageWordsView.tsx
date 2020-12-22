import React, {useEffect, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {
  Box,
  Button,
  Grid,
} from "@material-ui/core";
import {EditWordDrawer} from "./EditWordDrawer";
import {WordsTable} from "./WordsTable";
import {InspectWordDrawer} from "./InspectWordDrawer";
import {APIWordType, createAPIWord, retrieveAPIWords, updateAPIWord} from "../../API/APIWord";
import {AudioDrawer} from "./AudioDrawer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    manageWordsView: {
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

export const ManageWordsView: React.FC = () => {
  const classes = useStyles();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [wordConcerning, setWordConcerning] = useState<APIWordType|null>(null);
  const [wordsData, setWordsData] = useState<APIWordType[]>([])
  const [drawer, setDrawer] = useState("");
  const createOrModifyWord = (word: APIWordType) => {
    if (word.uuid === "") {
      createAPIWord(word)
        .then(data => {
          console.log("Creation of a new word succeeded.")
          loadWords()
        })
        .catch(err => {
          console.log("Creation of a new word failed.", err)
        })
    } else {
      updateAPIWord(word)
        .then(data => {
          console.log("Update of a word succeeded.")
          loadWords()
        })
        .catch(err => {
          console.log("Update of a word failed.", err)
        })
    }
  };
  const loadWords = () => {
    retrieveAPIWords()
      .then(data => {
        console.log("Retrieval of words data succeeded.")
        setWordsData(data)
      })
      .catch(err => {
        console.log("Retrieval of words data failed.", err)
      })
  }
  useEffect(() => {
    loadWords()
  }, [])
  const onClickAddNewWord = () => {
    const blankWord: APIWordType = {
      uuid: "",
      kanji: "",
      kana: "",
      meaning: "",
      category: []
    }
    setDrawer("editor");
    setWordConcerning(blankWord);
    setIsDrawerOpen(true);
  }
  const onClickOpenEditor = (word: APIWordType) => {
    setDrawer("editor");
    setWordConcerning(word);
    setIsDrawerOpen(true);
  }
  const onClickOpenInspector = (word: APIWordType) => {
    setDrawer("inspector");
    setWordConcerning(word);
    setIsDrawerOpen(true);
  }
  const onClickOpenAudioManager = (word: APIWordType) => {
    setDrawer("audioManager")
    setWordConcerning(word)
    setIsDrawerOpen(true)
  }
  return <div className={classes.manageWordsView}>
    <Grid container>
      <Grid item xs={6}>
        <Box className={classes.toolButtonsContainer}>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box display={"flex"} justifyContent={"center"}>
          <Button variant={"outlined"} onClick={onClickAddNewWord}>Add new word</Button>
        </Box>
      </Grid>
    </Grid>
    <Box mt={2} style={{maxHeight: "100%"}}>
      <WordsTable
        key={wordsData.length}
        words={wordsData}
        actionButtons={[
          {buttonName: "EDIT", action: onClickOpenEditor},
          {buttonName: "INSPECT", action: onClickOpenInspector},
          {buttonName: "AUDIO", action: onClickOpenAudioManager}
        ]}
      />
      {drawer === "editor" && wordConcerning && <EditWordDrawer
        key={wordConcerning.uuid} isOpen={isDrawerOpen} onClose={()=>{setIsDrawerOpen(false); setDrawer("")}}
        word={wordConcerning} createOrModifyWord={createOrModifyWord}
      />}
      {drawer === "inspector" && wordConcerning && <InspectWordDrawer
        key={wordConcerning.uuid} isOpen={isDrawerOpen} onClose={()=>{setIsDrawerOpen(false); setDrawer("")}}
        word={wordConcerning}
      />}
      {drawer === "audioManager" && wordConcerning && <AudioDrawer
        key={wordConcerning.uuid} isOpen={isDrawerOpen} onClose={()=>{setIsDrawerOpen(false); setDrawer("")}}
        word={wordConcerning}
      />}
    </Box>
  </div>
}