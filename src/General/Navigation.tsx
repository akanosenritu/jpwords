import React, {useContext, useState} from "react";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import {MyLink} from "./Components/MyLink";
import {Dialog} from "@material-ui/core";
import {LoginDialog} from "./LoginDialog";
import {UserContext} from "../data/User";
import Box from "@material-ui/core/Box"
import {SignUpDialog} from "./SignUpDialog";
import SettingsIcon from '@material-ui/icons/Settings';
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: "#99c2ff"
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    drawerList: {
      width: 250
    }
  }),
);

export const Navigation: React.FC = () => {
  const classes = useStyles()
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false)
  const {user, logout} = useContext(UserContext)
  const onClickLogout = () => {
    logout()
  }
  return <div className={classes.root}>
    <AppBar position="static" color={"default"}>
      <Toolbar variant={"dense"} style={{display:"flex", justifyContent: "space-between"}}>
        <Box display={"flex"}>
          <Box mx={3}>
            <Typography variant={"h6"}><MyLink to={"/words/practiceWordList/"}>Vocabulary</MyLink></Typography>
          </Box>
          <Box mx={3}>
            <Typography variant={"h6"}><MyLink to={"/grammar/particles/"}>Grammar</MyLink></Typography>
          </Box>
        </Box>
        <Box>
          {user.status === "Authenticated" ?
            <Box display={"inline-block"}>
              <Box mr={4} display={"inline-block"}>
                Logged in as <span style={{color: "green", fontWeight: "bold"}}>{user.username}</span>
              </Box>
              <Button onClick={onClickLogout}>Logout</Button>
            </Box>:
            <>
              <Button color="inherit" onClick={()=>setIsLoginDialogOpen(true)}>Login</Button>
              <Button color="inherit" onClick={()=>setIsSignUpDialogOpen(true)}>Sign up</Button>
            </>
          }
          <a href={"/settings/"}>
            <IconButton>
              <SettingsIcon />
            </IconButton>
          </a>
        </Box>
        <Dialog open={isLoginDialogOpen} onClose={()=>setIsLoginDialogOpen(false)}>
          <LoginDialog close={()=>setIsLoginDialogOpen(false)}/>
        </Dialog>
        <Dialog open={isSignUpDialogOpen} onClose={()=>setIsSignUpDialogOpen(false)}>
          <SignUpDialog close={()=>setIsSignUpDialogOpen(false)}/>
        </Dialog>
      </Toolbar>
    </AppBar>
  </div>
}