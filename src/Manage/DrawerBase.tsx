import React from "react";
import {Box, Drawer, IconButton} from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: 400
    },
    drawerHeader: {
      borderBottom: "1px solid darkgray"
    }
  })
)

type DrawerBaseProps = {
  isOpen: boolean,
  onClose: () => void,
  inside: any
}

export const DrawerBase: React.FC<DrawerBaseProps> = props => {
  const classes = useStyles();
  return <Drawer
    variant={"persistent"} anchor={"right"} open={props.isOpen}
  >
    <Box className={classes.drawer} p={1}>
      <Box display={"flex"} justifyContent={"left"} className={classes.drawerHeader}>
        <IconButton onClick={props.onClose}>
          <ChevronRightIcon/>
        </IconButton>
      </Box>
      <Box mt={2}>
        {props.inside}
      </Box>
    </Box>
  </Drawer>
}