import React, {useContext} from "react"

import Box from "@material-ui/core/Box"
import HelpIcon from '@material-ui/icons/Help'
import IconButton from "@material-ui/core/IconButton"
import makeStyles from "@material-ui/core/styles/makeStyles"
import ReplayIcon from '@material-ui/icons/Replay'
import SaveIcon from '@material-ui/icons/Save'
import SettingsIcon from '@material-ui/icons/Settings'
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"

import {APIWordNoteContentType} from "../../../API/APIWordNoteContent"
import {LanguageSelector} from "./LanguageSelector"
import {LanguageContext2} from "../../../data/Language"
import {ContentEditorEntryStatusText} from "./ContentEditorEntry"

const useStyles = makeStyles({
  toolbar: {
    backgroundColor: "#e6e6e6",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    verticalAlign: "middle",
  },
  toolbarTopBox: {
    width: "100%",
    alignItems: "center",
  },
  toolbarDisplayLanguageSelector: {
    width: 200
  },
  toolbarIconButton: {
    marginLeft: 5
  },
  toolbarTitle: {
    fontWeight: "bold"
  }
})

type Props = {
  wordNoteContent: APIWordNoteContentType,
  statusText: ContentEditorEntryStatusText,
  onClickSave: () => void,
  onClickReload: () => void
}

export const ContentEditorToolbar: React.FC<Props> = (props) => {
  const classes = useStyles()
  const {language, setLanguage} = useContext(LanguageContext2)
  const getStatusText = (statusText: ContentEditorEntryStatusText) => {
    switch(statusText.status) {
      case "success":
        return <span style={{color: "green"}}>{statusText.text}</span>
      case "error":
        return <span style={{color: "red"}}>{statusText.text}</span>
      case "none":
        return <></>
    }
  }
  return <Toolbar variant={"dense"} className={classes.toolbar}>
    <Box display={"flex"} justifyContent={"space-between"} className={classes.toolbarTopBox}>
      <Typography variant={"subtitle1"} className={classes.toolbarTitle}>WordNoteContent ({props.wordNoteContent.uuid || "not saved"}): {props.wordNoteContent.languages.join(", ")}</Typography>
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Box mr={2}>
          <Typography variant={"subtitle2"}>{getStatusText(props.statusText)}</Typography>
        </Box>
        <Box mr={2} display={"flex"} alignItems={"center"}>
          <Typography variant={"subtitle1"} style={{marginRight: 10}}>Display Language:</Typography>
          <Box className={classes.toolbarDisplayLanguageSelector}>
            <LanguageSelector selected={language} onSelect={setLanguage}/>
          </Box>
        </Box>
        <IconButton size={"small"} className={classes.toolbarIconButton}>
          <HelpIcon />
        </IconButton>
        <IconButton size={"small"} className={classes.toolbarIconButton}>
          <SettingsIcon />
        </IconButton>
        <IconButton size={"small"} className={classes.toolbarIconButton} onClick={props.onClickReload}>
          <ReplayIcon />
        </IconButton>
        <IconButton size={"small"} className={classes.toolbarIconButton} onClick={props.onClickSave}>
          <SaveIcon />
        </IconButton>
      </Box>
    </Box>
  </Toolbar>
}