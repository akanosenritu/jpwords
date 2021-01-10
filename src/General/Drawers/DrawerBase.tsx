import React from "react";
import {Box, Drawer, IconButton} from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      flexShrink: 0,
      width: 360
    },
    drawerPaper: {
      width: 400
    },
    drawerHeader: {
      borderBottom: "1px solid darkgray"
    }
  })
)

export type DrawerBaseProps = {
  onClose: () => void,
  inside: any
}

export const DrawerBase: React.FC<DrawerBaseProps> = props => {
  const classes = useStyles();
  return <Drawer
    variant={"persistent"} anchor={"right"} open={true} style={{width: 400}}
    elevation={0} classes={{paper: classes.drawerPaper}}
  >
    <Box className={classes.drawer} m={1}>
      <Box display={"flex"} justifyContent={"left"} className={classes.drawerHeader}>
        <IconButton onClick={props.onClose}>
          <ChevronRightIcon/>
        </IconButton>
      </Box>
      <Box mt={2} style={{width: "100%"}}>
        {props.inside}
      </Box>
    </Box>
  </Drawer>
}