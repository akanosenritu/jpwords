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
import {APIWordType, createAPIWord, retrieveAPIWords, updateAPIWord, deleteAPIWord} from "../../API/APIWord";
import {DeleteWordDrawer} from "./DeleteWordDrawer";

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

type DrawerString = "Editor" | "Inspector" | "Deleter" | ""

export const ManageWordsView: React.FC = () => {
  const classes = useStyles();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [wordConcerning, setWordConcerning] = useState<APIWordType|null>(null);
  const [wordsData, setWordsData] = useState<APIWordType[]>([])
  const [drawer, setDrawer] = useState<DrawerString>("");
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
          const index = wordsData.findIndex(word => word.uuid === data.uuid)
          const newWordsData = [...wordsData]
          newWordsData[index] = data
          setWordsData(newWordsData)
        })
        .catch(err => {
          console.log("Update of a word failed.", err)
        })
    }
  };
  const deleteWord = (word: APIWordType, replaceToUUID?: string) => {
    deleteAPIWord(word, replaceToUUID)
      .then(result => {
        if (result.status === "success") {
          setWordsData(wordsData => {
            const index = wordsData.findIndex(w => w.uuid === word.uuid)
            if (index === -1) return wordsData
            const newWordsData = [...wordsData]
            newWordsData.splice(index, 1)
            return newWordsData
          })
        }
        else console.log("deletion of the word failed.", result.reason)
      })
  }
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

  // click handlers for the action buttons
  const onClickOpenDrawer = (word: APIWordType, drawer: DrawerString) => {
    setDrawer(drawer)
    setWordConcerning(word)
    setIsDrawerOpen(true)
  }
  const onClickAddNewWord = () => {
    const blankWord: APIWordType = {
      uuid: "",
      kanji: "",
      kana: "",
      meaning: "",
      category: []
    }
    onClickOpenDrawer(blankWord, "Editor")
  }
  const onClickOpenEditor = (word: APIWordType) => {
    onClickOpenDrawer(word, "Editor")
  }
  const onClickOpenInspector = (word: APIWordType) => {
    onClickOpenDrawer(word, "Inspector")
  }
  const onClickOpenDeleter = (word: APIWordType) => {
    onClickOpenDrawer(word, "Deleter")
  }

  const handleDrawerClose = () => {
    setDrawer("")
    setIsDrawerOpen(false)
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
        words={wordsData}
        actionButtons={[
          {buttonName: "EDIT", action: onClickOpenEditor},
          {buttonName: "INSPECT", action: onClickOpenInspector},
          {buttonName: "DELETE", action: onClickOpenDeleter}
        ]}
      />
      {drawer === "Editor" && wordConcerning &&
        <EditWordDrawer
          createOrModifyWord={createOrModifyWord}
          isOpen={isDrawerOpen}
          key={wordConcerning.uuid}
          onClose={handleDrawerClose}
          word={wordConcerning}
        />
      }
      {drawer === "Inspector" && wordConcerning &&
        <InspectWordDrawer
          isOpen={isDrawerOpen}
          key={wordConcerning.uuid}
          onClose={handleDrawerClose}
          word={wordConcerning}
        />
      }
      {drawer === "Deleter" && wordConcerning &&
        <DeleteWordDrawer
          deleteWord={deleteWord}
          isOpen={isDrawerOpen}
          key={wordConcerning.uuid}
          onClose={handleDrawerClose}
          isValidWordUUID={(uuid: string) => {
            return wordsData.findIndex(word => word.uuid === uuid) !== -1
          }}
          word={wordConcerning}
        />
      }
    </Box>
  </div>
}