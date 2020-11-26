import wordNotesContentURL from "./wordNotesContent.md";
import ReactMarkDown from "react-markdown";
import React, {useContext, useEffect, useState} from "react";
import {Box, Button, Typography} from "@material-ui/core";
import wordNotesData from "./wordNotes.json";
import {WordType} from "../Word";
import {initialConfigurations, useConfigurations} from "../Storage/Configurations";
import {PrintMarkDown} from "../../General/Components/PrintMarkDown";

const prepareWordNotes = () => {
  const wordNotes =  wordNotesData["wordNotes"] as WordNoteType[];
  let wordNotesByWord: {[key: string]: WordNoteType[]} = {};
  let wordNotesByCategory: {[key: string]: WordNoteType[]} = {};
  let wordNotesByUUID: {[key: string]: WordNoteType} = {};
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
    wordNotesByUUID[wordNote.id] = wordNote;
  }
  return [wordNotesByWord, wordNotesByCategory, wordNotesByUUID] as const;
}

const [availableWordNotesByWord, availableWordNotesByCategory, availableWordNotesByUUID] = prepareWordNotes();
export const wordNotesDataLastEditDate = wordNotesData.lastEdit;
export {availableWordNotesByWord, availableWordNotesByCategory, availableWordNotesByUUID};

export type WordNoteType = {
  id: string
  associatedWords?: string[]  // in the form of uuids
  associatedCategories?: string[]  // in the form of category names
  title: string,
  description?: string,
  content: string
};

type WordNoteProps = {
  wordNote: WordNoteType
}

export const WordNote: React.FC<WordNoteProps> = (props) => {
  const {configurations} = useConfigurations(initialConfigurations);
  const [wordNoteHiddenStatus, setWordNoteHiddenStatus] = useState<boolean>(configurations.hideWordNotes);
  return <Box m={1}>
    <p style={{borderLeft: "3px solid lightgray", paddingLeft: 10}} onClick={()=>setWordNoteHiddenStatus(!wordNoteHiddenStatus)}>
      <Typography variant={"subtitle1"}>{props.wordNote.title.toUpperCase()}</Typography>
    </p>
    {!wordNoteHiddenStatus && <>
      <Box style={{fontSize: 14}}>
        <PrintMarkDown content={props.wordNote.content} />
      </Box>
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
          return <WordNote wordNote={wordNote} key={wordNote.id} />
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