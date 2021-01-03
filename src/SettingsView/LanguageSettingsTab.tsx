import React, {useState} from "react";
import {initialConfigurations, useConfigurations} from "../LocalStorage/Configurations";
import {useFormik} from "formik";
import {Button} from "@material-ui/core";
import {LanguageSelector} from "../General/Components/LanguageSelector";

export const LanguageSettingsTab: React.FC= () => {
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
      <LanguageSelector language={configurations.language} onSelected={language => formik.setFieldValue("language", language)} />
    </div>
    <div style={{display:"flex", justifyContent: "center"}}>
      <div><Button type={"submit"} variant={"outlined"} color={"primary"}>Save</Button></div>
      <div>
        {savedAt && <span style={{marginLeft: 10}}>Last saved at {savedAt}</span>}
      </div>
    </div>
  </form>
}
