import React, {useState} from "react";
import {initialConfigurations, useConfigurations} from "../LocalStorage/Configurations";
import {useFormik} from "formik";
import {Button, Checkbox} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export const PracticeSettingsTab: React.FC= (props) => {
  const {configurations, setConfigurations} = useConfigurations(initialConfigurations);
  const [savedAt, setSavedAt] = useState("");
  const formik = useFormik({
    initialValues: configurations,
    onSubmit: (values) => {
      setConfigurations(values);
      setSavedAt(new Date().toISOString());
    }
  })
  return <form onSubmit={formik.handleSubmit}>
    <div style={{paddingLeft: 10}}>
      <FormControlLabel
        control={<Checkbox
          checked={formik.values.hardMode} onChange={formik.handleChange} name={"hardMode"} color={"primary"}
        />}
        label={"Hard mode. Answers with proper kanjis will only be accepted. Automatic conversion of Roma-ji is disabled."}
      />
      <FormControlLabel
        control={<Checkbox
          checked={formik.values.autoContinueNextWord} onChange={formik.handleChange} name={"autoContinueNextWord"} color={"primary"}
          disabled={true}
        />}
        label={"Automatically continue to the next word when I answer correctly (unimplemented)"}
      />
      <FormControlLabel
        control={<Checkbox checked={formik.values.hideWordNotes} onChange={formik.handleChange} name={"hideWordNotes"} color={"primary"}/>}
        label={"Hide word notes"}
      />
    </div>
    <div style={{display:"flex", justifyContent: "center"}}>
      <div><Button type={"submit"} variant={"outlined"} color={"primary"}>Save</Button></div>
      <div>
        {savedAt && <span style={{marginLeft: 10}}>Last saved at {savedAt}</span>}
      </div>
      </div>
    </form>
}
