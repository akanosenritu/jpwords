import React, {useState} from "react";
import {Box, Typography} from "@material-ui/core";
import wordNotesData from "./wordNotes.json";
import {WordType} from "../Word/Word";
import {initialConfigurations, useConfigurations} from "../Storage/Configurations";
import {WordNoteContent} from "./WordNoteContent";

export const wordNotesDataLastEditDate = wordNotesData.lastEdit;

export type WordNoteType = {
  id: string,
  title: string,
  description?: string,
};

type WordNoteProps = {
  wordNote: WordNoteType
}

type WordNotesProps = {
  word: WordType
}

export const WordNotes: React.FC<WordNotesProps> = (props) => {
  const wordNotes = props.word.associatedWordNotes? props.word.associatedWordNotes: [];
  return <Box pt={4} style={{width: "100%"}}>
    {wordNotes.length > 0 && <div style={{width: "80%", margin: "auto", border: "1px solid lightgray", borderRadius: 25}}>
      <Box>
        {wordNotes.map(wordNote => {
          return <WordNote2 wordNote={wordNote} key={wordNote.id} />
        })}
      </Box>
    </div>}
  </Box>
}

export const WordNote2: React.FC<WordNoteProps> = (props) => {
  const {configurations} = useConfigurations(initialConfigurations);
  return <Box m={1}>
    <p style={{borderLeft: "3px solid lightgray", paddingLeft: 10}}>
      <Typography variant={"subtitle1"}>{props.wordNote.title.toUpperCase()}</Typography>
    </p>
    {!configurations.hideWordNotes && <>
      <Box style={{fontSize: 14}}>
        <WordNoteContent uuid={props.wordNote.id} />
      </Box>
    </>
    }
  </Box>
}