import React, {useState} from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  IconButton,
  Typography
} from "@material-ui/core";
import SettingsIcon from '@material-ui/icons/Settings';
import {useFormik} from "formik";
import {initialConfigurations, useConfigurations} from "../data/Storage/Configurations";
import {Header} from "./Components/Header";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export const ConfigurationsEntry: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return <div style={{position: "absolute", top: 0, bottom: "auto", zIndex: 1, width: "100%"}}>
    <div style={{display:"flex", justifyContent: "end", width: "100%"}}>
      <div style={{margin: "0 0 0 auto"}}>
        <IconButton onClick={()=>setIsDialogOpen(true)}>
          <SettingsIcon />
        </IconButton>
      </div>
    </div>
    <ConfigurationsScreen onClose={()=>setIsDialogOpen(false)} isOpen={isDialogOpen} />
  </div>
}

type ConfigurationsScreenProps = {
  onClose: () => void,
  isOpen: boolean
}

const ConfigurationsScreen: React.FC<ConfigurationsScreenProps> = (props) => {
  const {configurations, setConfigurations} = useConfigurations(initialConfigurations);
  const [savedAt, setSavedAt] = useState("");
  const formik = useFormik({
    initialValues: configurations,
    onSubmit: (values) => {
      setConfigurations(values);
      setSavedAt(new Date().toISOString());
    }
  })
  return <Dialog onClose={props.onClose} open={props.isOpen}>
    <DialogContent>
      <form onSubmit={formik.handleSubmit}>
        <Header content={"Language"} />
        <div style={{paddingLeft: 10}}>
          <FormControl component="fieldset">
            <RadioGroup row={true} name="language" value={formik.values.language} onChange={formik.handleChange}>
              <FormControlLabel value="ESP" control={<Radio />} label="Español" />
              <FormControlLabel value="ENG" control={<Radio />} label="English" />
            </RadioGroup>
          </FormControl>
        </div>
        <Header content={"Word Practice Settings"} />
        <div style={{paddingLeft: 10}}>
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
        <Button type={"submit"} variant={"outlined"} color={"primary"}>Save</Button>
        {savedAt && <span style={{marginLeft: 10}}>Last saved at {savedAt}</span>}
      </form>
    </DialogContent>
  </Dialog>
}
