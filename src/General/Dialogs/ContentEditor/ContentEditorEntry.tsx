import React, {ChangeEvent, useState} from "react"

import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import makeStyles from "@material-ui/core/styles/makeStyles"
import {LanguageProvider2} from "../../../data/Language"
import {WordNoteContentPreview} from "../WordNoteContentPreview"
import {ContentEditorToolbar} from "./ContentEditorToolbar"
import {
  APIWordNoteContentType,
  createAPIWordNoteContent,
  updateAPIWordNoteContent
} from "../../../API/APIWordNoteContent"

const useStyles = makeStyles({
  topBox: {
    border: "3px solid darkgray",
    borderRadius: 25
  },
  toolBarContainer: {
    borderBottom: "3px solid darkgray"
  },
  contentEditorEditor: {
    marginTop: 10
  }
})

type Props = {
  wordNoteContent: APIWordNoteContentType,
  reload: () => void
}

export type ContentEditorEntryStatusText = {
  status: "success",
  text: string
} | {
  status: "error",
  text: string
} | {
  status: "none"
}

export const ContentEditorEntry: React.FC<Props> = props => {
  const classes = useStyles()

  const [statusText, setStatusText] = useState<ContentEditorEntryStatusText>({status: "none"})

  // editingText
  const [editingText, setEditingText] = useState(props.wordNoteContent.content)
  const handleEdit = (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setEditingText(event.target.value)
  }

  const save = async () => {
    const editedWordNoteContent = {...props.wordNoteContent}
    editedWordNoteContent.content = editingText
    const result = await (props.wordNoteContent.uuid? updateAPIWordNoteContent(editedWordNoteContent): createAPIWordNoteContent(editedWordNoteContent))
    if (result.status === "success") {
      setStatusText({
        status: "success",
        text: `Saved: ${new Date().toISOString()} (UTC)`
      })
    } else {
      setStatusText({
        status: "error",
        text: `Save failed: ${new Date().toISOString()} (UTC)`
      })
    }
  }
  const reload = () => {
    setEditingText(props.wordNoteContent.content)
  }

  return <Box className={classes.topBox}>
    <LanguageProvider2 language={"en"}>
      <Box className={classes.toolBarContainer}>
        <ContentEditorToolbar
          onClickSave={save}
          onClickReload={reload}
          statusText={statusText}
          wordNoteContent={props.wordNoteContent}
        />
      </Box>
      <Box className={classes.contentEditorEditor}>
        <Grid container>
          <Grid item xs={6}>
            <Box ml={3} mr={1}>
              <WordNoteContentPreview content={editingText} />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box mr={3} >
              <TextField
                onChange={handleEdit}
                value={editingText} variant={"outlined"} fullWidth inputProps={{fontSize: 20}} multiline={true}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </LanguageProvider2>
  </Box>
}