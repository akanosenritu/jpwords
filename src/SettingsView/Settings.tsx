import React, {ChangeEvent, useContext, useState} from "react";
import Box from "@material-ui/core/Box";
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
  return <div style={{minWidth: 320, maxWidth: 500, margin: "auto", position:"relative"}}>
    <Box mt={2}>
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
      <TabPanel value={tabIndex} index={1}>
        <p>Currently only English is available.</p>
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <PracticeSettingsTab />
      </TabPanel>
    </Box>
  </div>
}