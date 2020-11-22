import React, {useState} from "react";
import {
  Box, Button,
  Checkbox,
  Dialog,
  DialogContent,
  FormControlLabel,
  IconButton,
  Typography
} from "@material-ui/core";
import SettingsIcon from '@material-ui/icons/Settings';
import {useFormik} from "formik";
import {initialConfigurations, useConfigurations} from "../data/Storage/Configurations";

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
        <Box style={{borderLeft: "5px solid lightgray", paddingLeft: 10}}>
          <Typography variant={"h6"}>Word Practice Settings</Typography>
        </Box>
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
