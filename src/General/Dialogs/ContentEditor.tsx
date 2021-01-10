import React, {useCallback, useEffect, useState} from "react"

// material-ui
import Box from "@material-ui/core/Box"
import CloseIcon from '@material-ui/icons/Close'
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"


import {APIWordNoteType} from "../../API/APIWordNote"
import {
  APIWordNoteContentType,
  createBlankAPIWordNoteContent,
  getAPIWordNoteContent
} from "../../API/APIWordNoteContent"
import {ContentEditorEntry} from "./ContentEditor/ContentEditorEntry"
import {Language} from "../../data/Language"
import {CreateNewContent} from "./ContentEditor/CreateNewContent"
import {Typography} from "@material-ui/core"


type ContentEditorProps = {
  onClose: ()=>void,
  wordNote: APIWordNoteType
}

export const ContentEditor: React.FC<ContentEditorProps> = props => {
  const [contents, setContents] = useState<APIWordNoteContentType[]>([])
  const loadContents = useCallback(async () => {
    const result = await getAPIWordNoteContent(props.wordNote.uuid)
    if (result.status === "success") {
      setContents(result.data)
    }
  }, [props.wordNote.uuid])
  useEffect(() => {
    loadContents()
  }, [loadContents])

  const createNewContent = (languages: Language[]) => {
    const blankContent = createBlankAPIWordNoteContent(props.wordNote, languages)
    setContents([...contents, blankContent])
  }

  return <Box m={1}>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} mx={3}>
          <Typography variant={"h5"}>Edit word note contents</Typography>
          <Box display={"flex"}>
            <CreateNewContent onClickCreateNew={createNewContent} />
            <IconButton onClick={props.onClose}>
              <CloseIcon fontSize={"large"} />
            </IconButton>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        {contents.map(content => {
          return <Box m={1}>
            <ContentEditorEntry wordNoteContent={content} reload={loadContents}/>
          </Box>
        })}
        {contents.length === 0 && <Typography variant={"h6"}>No content is attached to this word note. Add one from the top right add button.</Typography>}
      </Grid>
    </Grid>
  </Box>
}