import React, {useEffect, useState} from "react";
import {Box, Button, CircularProgress, TextField} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {FormikErrors, useFormik} from "formik"
import {DrawerBase} from "../DrawerBase";
import {APIWordType} from "../../API/APIWord";
import {H5, H6} from "../../General/Components/Headers";
import {Paragraph} from "../../General/Components/Paragraph";
import {APIAudioFile, createAudio, getAudioForWord} from "../../API/APIAudioFile";
import {PlayAudioButton} from "../../General/Components/PlayAudioButton";
import CheckIcon from '@material-ui/icons/Check';
import ErrorIcon from '@material-ui/icons/Error';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    editor: {
      "& .MuiFormControl-root": {
        margin: theme.spacing(2)
      }
    }
  })
)

type AudioManagerProps = {
  word: APIWordType,
  onClose: () => void
}

type AudioGenerationStatus = "Initial" | "Generating" | "Success" | "Failure"

const AudioManager: React.FC<AudioManagerProps> = props => {
  const classes = useStyles();

  const [audioFile, setAudioFile] = useState<APIAudioFile|null>(null)
  useEffect(() => {
    getAudioForWord(props.word.uuid)
      .then(result => {
        if (result.status === "success") setAudioFile(result.audioFile)
      })
      .catch(err => {})
  }, [props.word.uuid])

  const [generationStatus, setGenerationStatus] = useState<AudioGenerationStatus>("Initial")
  const onClickGenerate = () => {
    setGenerationStatus("Generating")
    createAudio(formik.values.text, props.word.uuid)
      .then(result => {
        if (result.status === "success") {
          setGenerationStatus("Success")
          setAudioFile(result.audioFile)
        } else {
          setGenerationStatus("Failure")
        }
      })
  }

  const formik = useFormik({
    initialValues: {
      text: props.word.kana
    },
    validate: (values) => {
      const errors: FormikErrors<APIWordType> = {};
      return errors
    },
    onSubmit: ()=>{
      props.onClose()
    }
  });

  return <form onSubmit={formik.handleSubmit} className={classes.editor}>
    <H5>Manage audio</H5>
    <Paragraph>
      <H6>Audio associated</H6>
        <Paragraph>
          {audioFile?
            <><span>{audioFile.text}</span><PlayAudioButton key={audioFile.url} wordUUID={props.word.uuid} url={audioFile.url} /></>:
            <span>No audio attached</span>
          }
        </Paragraph>
      <H6>Create a new audio</H6>
      <Paragraph>
        <TextField
          fullWidth={true} name={"text"} label={"Text"} placeholder={"text"} value={formik.values.text}
          onChange={formik.handleChange}
        />
        <Box display={"flex"} justifyContent={"center"}>
          <Button variant={"outlined"} color={"primary"} onClick={onClickGenerate}>Generate</Button>
          <div style={{verticalAlign: "-20%", display: "inline-block"}}>
            {generationStatus === "Generating" && <CircularProgress size={20}/>}
            {generationStatus === "Success" && <CheckIcon />}
            {generationStatus === "Failure" && <ErrorIcon />}
          </div>
        </Box>
      </Paragraph>
    </Paragraph>
  </form>
}

type AudioDrawerProps = {
  onClose: () => void,
  isOpen: boolean,
  word: APIWordType,
}

export const AudioDrawer: React.FC<AudioDrawerProps> = props => {
  return <DrawerBase
    isOpen={props.isOpen} onClose={props.onClose}
    inside={<AudioManager word={props.word} onClose={props.onClose} />}
  />
}