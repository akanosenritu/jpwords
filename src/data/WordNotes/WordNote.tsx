import React from "react";
import {Box, Typography} from "@material-ui/core";
import {WordType} from "../Word/Word";
import {initialConfigurations, useConfigurations} from "../../LocalStorage/Configurations";
import {WordNoteContent} from "./WordNoteContent";
import {LanguageProvider} from "../Language";

export type WordNoteType = {
  uuid: string,
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
  const {configurations} = useConfigurations(initialConfigurations)
  return <LanguageProvider language={configurations.language}>
    <Box pt={4} style={{width: "100%"}}>
      {wordNotes.length > 0 && <div style={{width: "80%", margin: "auto", border: "1px solid lightgray", borderRadius: 25}}>
        <Box>
          {wordNotes.map(wordNote => {
            return <WordNote2 wordNote={wordNote} key={wordNote.uuid} />
          })}
        </Box>
      </div>}
    </Box>
  </LanguageProvider>
}

export const WordNote2: React.FC<WordNoteProps> = (props) => {
  const {configurations} = useConfigurations(initialConfigurations);
  return <Box m={1}>
    <p style={{borderLeft: "3px solid lightgray", paddingLeft: 10}}>
      <Typography variant={"subtitle1"}>{props.wordNote.title.toUpperCase()}</Typography>
    </p>
    {!configurations.hideWordNotes && <>
      <Box style={{fontSize: 15}}>
        <WordNoteContent uuid={props.wordNote.uuid} />
      </Box>
    </>
    }
  </Box>
}
