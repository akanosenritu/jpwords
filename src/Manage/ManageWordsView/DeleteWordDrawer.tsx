import React from "react"
import {Box, Button, TextField, Typography} from "@material-ui/core"
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles"
import {FormikErrors, useFormik} from "formik"
import {DrawerBase} from "../DrawerBase"
import {APIWordType} from "../../API/APIWord"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    editor: {
      "& .MuiFormControl-root": {
        margin: theme.spacing(2)
      }
    }
  })
)

type DeleterProps = {
  word: APIWordType
  deleteWord: (word: APIWordType, replaceToUUID?: string) => void,
  isValidWordUUID: (uuid: string) => boolean,
  onClose: () => void
}

const Deleter: React.FC<DeleterProps> = props => {
  const classes = useStyles();
  const formik = useFormik({
    initialValues: {
      replaceTo: ""
    },
    validate: (values) => {
      const errors: FormikErrors<{replaceTo: string}> = {};
      if (values.replaceTo && !props.isValidWordUUID(values.replaceTo)) {
        errors.replaceTo = "Not a valid word uuid."
      }
      return errors
    },
    onSubmit: ()=>{
      const replaceTo = formik.values.replaceTo !== ""? formik.values.replaceTo: undefined
      props.deleteWord(props.word, replaceTo)
      props.onClose()
    }
  });
  return <form onSubmit={formik.handleSubmit} className={classes.editor}>
    <Box style={{borderLeft: "5px solid lightgray", paddingLeft: 10}} ml={1}>
      <Typography variant={"h6"}>Delete the word</Typography>
    </Box>
    <TextField
      fullWidth={true} label={"Replace to (UUID). Optional."} name={"replaceTo"} placeholder={"Replace to"} value={formik.values.replaceTo}
      onChange={formik.handleChange} error={!!formik.errors.replaceTo} helperText={formik.errors.replaceTo} autoComplete={"off"}
    />
    <Box display={"flex"} justifyContent={"center"} mt={2}>
      <Button variant={"outlined"} color={"secondary"} type={"submit"}>Delete</Button>
    </Box>
  </form>
}

type DeleteWordDrawerProps = {
  onClose: () => void,
  isOpen: boolean,
  isValidWordUUID: (uuid: string) => boolean,
  word: APIWordType,
  deleteWord: (word: APIWordType, replaceToUUID?: string) => void,
}

export const DeleteWordDrawer: React.FC<DeleteWordDrawerProps> = props => {
  return <DrawerBase
    isOpen={props.isOpen} onClose={props.onClose}
    inside={<Deleter
      word={props.word} deleteWord={props.deleteWord} onClose={props.onClose}
      isValidWordUUID={props.isValidWordUUID}
    />}
  />
}