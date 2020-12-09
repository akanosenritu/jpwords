import React, {ChangeEvent, useContext, useState} from "react";
import {Header} from "../General/Components/Header";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import {Button, Checkbox} from "@material-ui/core";
import {useFormik} from "formik";
import {initialConfigurations, useConfigurations} from "../data/Storage/Configurations";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import TextField from "@material-ui/core/TextField";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {PracticeSettingsTab} from "./PracticeSettingsTab";
import Typography from "@material-ui/core/Typography";
import {AccountSettingsTab} from "./AccountSettingsTab";
import {UserContext} from "../data/User";

type TabPanelProps = {
  value: any,
  index: any,
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const Settings: React.FC = props => {
  const {user} = useContext(UserContext)
  const [tabIndex, setTabIndex] = useState(0)
  const handleTabChange = (event: ChangeEvent<{}>, newTabIndex: any) => {
    setTabIndex(newTabIndex)
  }
  return <Box mt={2}>
    <Box style={{textAlign: "center"}} m={2}>
      <Typography variant={"h5"}>Settings</Typography>
    </Box>
    <Tabs
      centered={true}
      indicatorColor={"primary"}
      onChange={handleTabChange}
      value={tabIndex}
    >
      <Tab label={"Account"} />
      <Tab label={"Language"} />
      <Tab label={"Practice"} />
    </Tabs>
    <TabPanel value={tabIndex} index={0}>
      {user.status === "Authenticated"?
        <AccountSettingsTab />:
        <p>Authenticated User Only</p>
      }

    </TabPanel>
    <TabPanel value={tabIndex} index={2}>
      <PracticeSettingsTab />
    </TabPanel>
  </Box>
}