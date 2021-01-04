import {APIWordNoteType, getWordNoteContentTextFromGithub} from "../../API/APIWordNote";
import React, {ChangeEvent, createElement, useCallback, useEffect, useState} from "react";
import {Box, Button, Grid, TextField} from "@material-ui/core";
import {WordNoteContentPreview} from "./WordNoteContentPreview";
import {initialConfigurations, useConfigurations} from "../../LocalStorage/Configurations";
import {LanguageProvider} from "../../data/Language";
import {LanguageSelector} from "../Components/LanguageSelector";
import {getEditingData, setEditingData} from "../../LocalStorage/EditingData";

type ContentEditorProps = {
  onClose: ()=>void,
  wordNote: APIWordNoteType
}

const getIdentifierString = (uuid: string) => {
  return `word-note-${uuid}`
}

export const ContentEditor: React.FC<ContentEditorProps> = props => {
  const [content, setContent] = useState("");
  const loadContent = useCallback(async () => {
    
    const loadContentFromLocalStorage = () => {
      return getEditingData(getIdentifierString(props.wordNote.uuid))
    }
    const loadContentFromGithub = async () => {
      return await getWordNoteContentTextFromGithub(props.wordNote.uuid)
    }
    
    const result = loadContentFromLocalStorage()
    if (result.status === "success") setContent(result.data)
    else {
      const result2 = await loadContentFromGithub()
      if (result2.status === "success") setContent(result2.text)
      else setContent("ERROR")
    }
  }, [props.wordNote.uuid])
  
  useEffect(() => {
    loadContent()
  }, [loadContent])

  const onSave = () => {
    setEditingData(getIdentifierString(props.wordNote.uuid), content)
  }

  const onDownload = () => {
    const fileName = `${props.wordNote.uuid}.mdx`
    const aElement = document.createElement("a")
    aElement.download = fileName
    aElement.href = URL.createObjectURL(new Blob([content], {type : 'text/plain'}))
    aElement.click()
  }

  const {configurations} = useConfigurations(initialConfigurations)
  const [language, setLanguage] = useState(configurations.language)
  return <LanguageProvider language={language}>
    <Box m={1}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display={"flex"} justifyContent={"center"} mt={2}>
            <Button color={"primary"} variant={"contained"} onClick={()=>{onSave();props.onClose()}}>Save</Button>
            <Button color={"primary"} variant={"contained"} onClick={onDownload}>Download</Button>
            <Button color={"secondary"} variant={"contained"} onClick={loadContent}>Reload</Button>
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