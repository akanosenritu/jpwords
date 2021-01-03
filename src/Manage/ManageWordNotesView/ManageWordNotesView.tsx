import React from "react";
import {Box} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {WordNotesTable} from "./WordNotesTable";
import {APIWordNotesProvider} from "../../API/APIWordNoteProvider";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    manageWordNotesView: {
      width: "98%",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: 20,
      boxSizing: "border-box"
    },
    searchBox: {
      display: "flex",
      alignItems: "center",
      width: 400
    },
    searchBoxInput: {
      marginLeft: theme.spacing(1)
    },
    toolButtonsContainer: {
      "& .MuiButtonBase-root": {
        margin: theme.spacing(1)
      }
    }
  })
)

const ManageWordNotesView: React.FC = () => {
  const classes = useStyles();
  return <div className={classes.manageWordNotesView}>
    <Box mt={2} style={{maxHeight: "100%"}}>
      <APIWordNotesProvider>
        <WordNotesTable />
      </APIWordNotesProvider>
    </Box>
  </div>
}

export default ManageWordNotesView