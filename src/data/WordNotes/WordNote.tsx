import wordNotesContentURL from "./wordNotesContent.md";
import ReactMarkDown from "react-markdown";
import React, {useContext, useEffect, useState} from "react";
import {Box, Button, FormControlLabel, Typography} from "@material-ui/core";
import wordNotesData from "./wordNotes.json";
import {Checkbox} from "@material-ui/core";
import {WordType} from "../Word";
import {UserPreferenceContext} from "../../WordsView/Contexts";
import {saveUserPreference} from "../Storage/UserPreference";

const prepareWordNotes = () => {
  const wordNotes =  wordNotesData["wordNotes"] as WordNoteType[];
  let wordNotesByWord: {[key: string]: WordNoteType[]} = {};
  let wordNotesByCategory: {[key: string]: WordNoteType[]} = {};
  for (let wordNote of wordNotes) {
    const associatedWords = wordNote.associatedWords;
    const associatedCategories = wordNote.associatedCategories;
    if (associatedWords) {
      for (let associatedWord of associatedWords) {
        if (wordNotesByWord[associatedWord]) {
          wordNotesByWord[associatedWord].push(wordNote);
        } else {
          wordNotesByWord[associatedWord] = [wordNote];
        }
      }
    }
    if (associatedCategories) {
      for (let associatedCategory of associatedCategories) {
        if (wordNotesByCategory[associatedCategory]) {
          wordNotesByCategory[associatedCategory].push(wordNote);
        } else {
          wordNotesByCategory[associatedCategory] = [wordNote];
        }
      }
    }
  }
  return [wordNotesByWord, wordNotesByCategory]
}

const [availableWordNotesByWord, availableWordNotesByCategory] = prepareWordNotes();
console.log(availableWordNotesByWord, availableWordNotesByCategory);

export type WordNoteType = {
  id: string
  associatedWords?: string[]  // in the form of uuids
  associatedCategories?: string[]  // in the form of category names
  title: string,
  description?: string
};

let wordNotesContentsData: {[key: string]: string}|null = null;

const getWordNotesContentData = async () => {
  const contentsData = await fetch(wordNotesContentURL).then(res => res.text());
  const result: {[key: string]: string} = {};
  contentsData.split("!!!:").forEach(contentData => {
    const split = contentData.split("\r\n");
    const id = split[0]
    result[id] = split.slice(1).join("\n");
  })
  return result;
}

const getWordNoteContent = async (wordNoteId: string) => {
  if (!wordNotesContentsData) {
     wordNotesContentsData = await getWordNotesContentData();
  }
  console.log(wordNotesContentsData);
  console.log(wordNoteId);
  console.log(wordNotesContentsData[wordNoteId]);
  for (let i in wordNotesContentsData) {
    console.log(i, i === wordNoteId);
  }
  return wordNotesContentsData[wordNoteId];
}

type WordNoteProps = {
  wordNote: WordNoteType
}

const WordNote: React.FC<WordNoteProps> = (props) => {
  const [content, setContent] = useState<string>("");
  const userPreference = useContext(UserPreferenceContext);
  const [wordNoteHiddenStatus, setWordNoteHiddenStatus] = useState<boolean>(userPreference.wordNotesHiddenStatus[props.wordNote.id]);
  const updateWordNoteHiddenStatus = (isHidden: boolean) => {
    userPreference.wordNotesHiddenStatus[props.wordNote.id] = isHidden;
    setWordNoteHiddenStatus(isHidden);
    saveUserPreference(userPreference);
  }
  useEffect(() => {
    getWordNoteContent(props.wordNote.id).then(content => setContent(content));
  }, []);
  return <Box m={1}>
    <p style={{borderLeft: "3px solid lightgray", paddingLeft: 10}} onClick={()=>updateWordNoteHiddenStatus(!wordNoteHiddenStatus)}>
      <Typography variant={"subtitle1"}>{props.wordNote.title.toUpperCase()}</Typography>
    </p>
    {!wordNoteHiddenStatus && <>
      <Box style={{fontSize: 14}}>
        <ReactMarkDown>{content}</ReactMarkDown>
      </Box>
      <div style={{display: "flex", justifyContent: "center"}}>
        <Button color={"secondary"} onClick={() => updateWordNoteHiddenStatus(true)}>Hide</Button>
      </div>
    </>
    }
  </Box>
}

type WordNotesProps = {
  word: WordType
}

export const WordNotes: React.FC<WordNotesProps> = (props) => {
  const wordNotes = chooseWordNotes(props.word);
  return <Box pt={4} style={{width: "100%"}}>
    {wordNotes.length > 0 && <div style={{width: "80%", margin: "auto", border: "1px solid lightgray", borderRadius: 25}}>
      <Box>
        {wordNotes.map(wordNote => {
          return <WordNote wordNote={wordNote} />
        })}
      </Box>
    </div>}
  </Box>
}

const chooseWordNotes = (word: WordType) => {
  let result = [] as WordNoteType[];
  if (availableWordNotesByWord[word.uuid]) {
    result = result.concat(availableWordNotesByWord[word.uuid]);
  }
  for (let category of word.category) {
    if (availableWordNotesByCategory[category]) {
      result = result.concat(availableWordNotesByCategory[category]);
    }
  }
  return result
}