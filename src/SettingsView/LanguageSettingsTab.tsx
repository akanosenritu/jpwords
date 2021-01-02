import React, {useState} from "react";
import {initialConfigurations, useConfigurations} from "../LocalStorage/Configurations";
import {useFormik} from "formik";
import {Button} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import {languages} from "../data/Language";
import MenuItem from "@material-ui/core/MenuItem";

export const LanguageSettingsTab: React.FC= (props) => {
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
    <div style={{paddingLeft: 10, marginBottom: 10}}>
      <Select
        value={formik.values.language}
        name={"language"}
        onChange={formik.handleChange}
        fullWidth={true}
        variant={"outlined"}
      >
        {languages.map(language => {
          return <MenuItem value={language}>{language}</MenuItem>
        })}
        </Select>
    </div>
    <div style={{display:"flex", justifyContent: "center"}}>
      <div><Button type={"submit"} variant={"outlined"} color={"primary"}>Save</Button></div>
      <div>
        {savedAt && <span style={{marginLeft: 10}}>Last saved at {savedAt}</span>}
      </div>
    </div>
  </form>
}
