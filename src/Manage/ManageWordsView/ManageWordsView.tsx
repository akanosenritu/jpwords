import React, {useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {
  Box,
  Button,
  Grid,
  Typography,
} from "@material-ui/core";
import {availableWords, wordsDataLastEditDate, WordType} from "../../data/Word/Word";
import {EditWordDrawer} from "./EditWordDrawer";
import {WordsTable} from "./WordsTable";
import {initialEditingWordsData, useEditingWordsData} from "../../data/Storage/EditingWordsData";
import {v4 as uuid4} from "uuid";
import {InspectWordDrawer} from "./InspectWordDrawer";

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
  const [wordConcerning, setWordConcerning] = useState<WordType|null>(null);
  const {editingWordsData, setEditingWordsData} = useEditingWordsData(initialEditingWordsData);
  const [drawer, setDrawer] = useState("");
  const createOrModifyWord = (word: WordType) => {
    console.log(word);
    const newWordsData = {...editingWordsData};
    const newWords = {...newWordsData.words}
    newWords[word.uuid] = word;
    newWordsData.words = newWords
    newWordsData.lastEdit = new Date().toISOString();

    setEditingWordsData(newWordsData);
  };
  const reloadWords = () => {
    setEditingWordsData({
      words: availableWords,
      lastEdit: new Date().toISOString(),
      wordsDataBasedOnLastEdit: wordsDataLastEditDate
    })
  }
  const formatWordsData = (wordsData: {[key: string]: WordType}) => {
    return Object.values(wordsData).sort((wordA, wordB) => {
      if (wordA.kana > wordB.kana) return 1
      else if (wordA.kana < wordB.kana) return -1
      if (wordA.uuid > wordB.uuid) return 1
      else if (wordA.uuid < wordB.uuid) return -1
      return 0
    })
  }
  const downloadWordsData = () => {
    const words = formatWordsData(editingWordsData.words);
    const data = {
      lastEdit: new Date().toISOString(),
      words: words
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
    const aElement = document.createElement("a");
    aElement.download = "words.json";
    aElement.href = window.URL.createObjectURL(blob);
    aElement.click();
    aElement.remove()
  }
  const onClickAddNewWord = () => {
    const blankWord: WordType = {
      uuid: uuid4(),
      kanji: "",
      kana: "",
      meaning: "",
      category: []
    }
    setDrawer("editor");
    setWordConcerning(blankWord);
    setIsDrawerOpen(true);
  }
  const onClickOpenEditor = (word: WordType) => {
    setDrawer("editor");
    setWordConcerning(word);
    setIsDrawerOpen(true);
  }
  const onClickOpenInspector = (word: WordType) => {
    setDrawer("inspector");
    setWordConcerning(word);
    setIsDrawerOpen(true);
  }
  return <div className={classes.manageWordsView}>
    <Grid container>
      <Grid item xs={6}>
        <Box className={classes.toolButtonsContainer}>
          <Button variant={"outlined"} color={"primary"} onClick={downloadWordsData}>Download</Button>
          <Button variant={"outlined"} color={"secondary"} onClick={reloadWords}>Reload</Button>
          {editingWordsData.wordsDataBasedOnLastEdit !== wordsDataLastEditDate && <Typography variant={"body2"} display={"inline"} color={"secondary"}>
            The data basing on has been changed.
          </Typography>}
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
        words={formatWordsData(editingWordsData.words)}
        actionButtons={[
          {buttonName: "EDIT", action: onClickOpenEditor},
          {buttonName: "INSPECT", action: onClickOpenInspector}
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
    </Box>
  </div>
}