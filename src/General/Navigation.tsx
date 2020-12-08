import React, {useContext, useEffect, useState} from "react";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {MyLink} from "./Components/MyLink";
import {Dialog, Drawer} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {LoginDialog} from "./LoginDialog";
import {UserContext} from "../data/User";
import Box from "@material-ui/core/Box"
import {SignUpDialog} from "./SignUpDialog";

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false)
  const {user, logout} = useContext(UserContext)
  const onClickLogout = () => {
    logout()
  }
  return <div className={classes.root}>
    <AppBar position="static" color={"default"}>
      <Toolbar variant={"dense"} style={{display:"flex", justifyContent: "space-between"}}>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={()=>setIsDrawerOpen(!isDrawerOpen)}>
          <MenuIcon />
        </IconButton>
        <Drawer open={isDrawerOpen} onClose={()=>setIsDrawerOpen(false)}>
          <List className={classes.drawerList}>
            <ListItem>
              <ListItemText primary={<MyLink to={"/words/practiceWordList/"}>Vocabulary</MyLink>} />
            </ListItem>
            <ListItem>
              <ListItemText primary={<MyLink to={"/grammar/particles/"}>Grammar</MyLink>} />
            </ListItem>
          </List>
        </Drawer>
        <Box>
          {user.status === "Authenticated" ?
            <div>
              <Box mr={2} display={"inline-block"}>
                Logged in as <span style={{color: "green", fontWeight: "bold"}}>{user.username}</span>
              </Box>
              <Button onClick={onClickLogout}>Logout</Button>
            </div>:
            <>
              <Button color="inherit" onClick={()=>setIsLoginDialogOpen(true)}>Login</Button>
              <Button color="inherit" onClick={()=>setIsSignUpDialogOpen(true)}>Sign up</Button>
            </>
          }
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