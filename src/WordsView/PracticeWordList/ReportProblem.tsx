import React, {useState} from "react";
import {WordType} from "../../data/Word";
import {useFormik} from "formik";
import {Button, InputLabel, MenuItem, Select, TextField, Typography} from "@material-ui/core";

type ReportProblemProps = {
  word: WordType
}

const problemTypes: string[] = [
  "The meaning is too vague",
  "The meaning and the Japanese don't match",
  "Others"
]
export const ReportProblem: React.FC<ReportProblemProps> = (props) => {
  const [didSubmitSucceed, setDidSubmitSucceed] = useState<boolean|null>(null);
  const [errors, setErrors] = useState("");
  const formik = useFormik({
    initialValues: {
      problemType: "",
      problemDescription: ""
    },
    onSubmit: (values) => {
      if (!values.problemType) {
        setErrors("problem type is not set")
        return
      } else if (!values.problemDescription) {
        setErrors("problem description is not set")
        return
      } else {
        setErrors("")
      }

      const body = {
        wordUUID: props.word.uuid,
        problemType: formik.values.problemType,
        problemDescription: formik.values.problemDescription
      }
      fetch("https://arcane-crag-45532.herokuapp.com/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }).then(res => {
        if (!res.ok) throw new Error()
        else setDidSubmitSucceed(true)
      }).catch(error => setDidSubmitSucceed(false))
    }
  })
  return <div style={{minWidth: 300, padding: 15}}>
    <Typography variant={"h6"}>Report problems</Typography>
    <Typography variant={"body1"} style={{color: "red"}}>{errors}</Typography>
    <form onSubmit={formik.handleSubmit} style={{margin: 10}}>
      <InputLabel id="select-problem-type">Select problem type</InputLabel>
      <Select
        name={"problemType"} value={formik.values.problemType} onChange={formik.handleChange} fullWidth={true}
        labelId={"select-problem-type"}
      >
        {problemTypes.map(problemType => {
          return <MenuItem value={problemType}>{problemType}</MenuItem>
        })}
      </Select>
      <TextField
        name={"problemDescription"} label={"problem description (*required)"} onChange={formik.handleChange} fullWidth={true}
        multiline={true} rows={4} variant={"outlined"} style={{marginTop: 20}}
      />
      <Typography variant={"body2"}>Word UUID: {props.word.uuid}</Typography>
      <Button style={{margin: "auto"}} type={"submit"} variant={"outlined"} color={"primary"} disabled={!!didSubmitSucceed}>
        {!didSubmitSucceed? "Submit": "Successfully sent"}
      </Button>
    </form>
  </div>
}