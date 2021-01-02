import React from "react"
import {Box, Button, TextField, Typography} from "@material-ui/core"
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles"
import {FormikErrors, useFormik} from "formik"
import {APIWordType, isValidWordUUID} from "../../API/APIWord"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    editor: {
      "& .MuiFormControl-root": {
        margin: theme.spacing(2)
      }
    }
  })
)

type RemoverProps = {
  word: APIWordType
  deleteWord: (word: APIWordType, replaceToUUID?: string) => void,
  onClose: () => void
}

export const Remover: React.FC<RemoverProps> = props => {
  const classes = useStyles();

  // formik
  const formik = useFormik({
    initialValues: {
      replaceTo: ""
    },
    validate: async (values) => {
      const errors: FormikErrors<{replaceTo: string}> = {};
      const isValid = values.replaceTo? await isValidWordUUID(values.replaceTo): true
      if (values.replaceTo && !isValid) {
        errors.replaceTo = "Not a valid word uuid."
      }
      return errors
    },
    onSubmit: ()=>{
      const replaceTo = formik.values.replaceTo !== ""? formik.values.replaceTo: undefined
      props.onClose()
      props.deleteWord(props.word, replaceTo)
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
