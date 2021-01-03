import {APIWordNoteType} from "../../API/APIWordNote";
import React, {ChangeEvent, useState} from "react";
import {Box, Button, Grid, TextField} from "@material-ui/core";
import {WordNoteContentPreview} from "./WordNoteContentPreview";
import {initialConfigurations, useConfigurations} from "../../LocalStorage/Configurations";
import {LanguageProvider} from "../../data/Language";
import {LanguageSelector} from "../Components/LanguageSelector";

type ContentEditorProps = {
  onSave: (newContent: string) => void,
  onClose: ()=>void,
  wordNote: APIWordNoteType
}

export const ContentEditor: React.FC<ContentEditorProps> = props => {
  const [content, setContent] = useState(props.wordNote.content);
  const {configurations} = useConfigurations(initialConfigurations)
  const [language, setLanguage] = useState(configurations.language)
  return <LanguageProvider language={language}>
    <Box m={1}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display={"flex"} justifyContent={"center"} mt={2}>
            <Button color={"primary"} variant={"contained"} onClick={()=>{props.onSave(content);props.onClose()}}>Save</Button>
            <Button color={"secondary"} variant={"contained"} onClick={()=>setContent(props.wordNote.content)}>Reload</Button>
            <Button variant={"contained"} onClick={()=>props.onClose()}>Close</Button>
            <Box ml={2} style={{width: 200}}>
              <LanguageSelector language={language} onSelected={language => setLanguage(language)} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box ml={3} mr={1}>
            <LanguageProvider language={language}>
              <WordNoteContentPreview content={content} key={language} />
            </LanguageProvider>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box mr={3} >
            <TextField
              onChange={(event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setContent(event.target.value)}
              value={content} variant={"outlined"} fullWidth inputProps={{fontSize: 20}} multiline={true}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  </LanguageProvider>
}