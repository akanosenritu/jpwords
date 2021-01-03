import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {
  Box,
  Grid,
} from "@material-ui/core";
import {WordsTable} from "../../General/WordsTable/WordsTable";
import {APIWordNotesProvider} from "../../API/APIWordNoteProvider";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    manageWordsView: {
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

const ManageWordsView: React.FC = () => {
  const classes = useStyles();

  return <div className={classes.manageWordsView}>
    <Grid container>
      <Grid item xs={6}>
        <Box className={classes.toolButtonsContainer}>
        </Box>
      </Grid>
      <Grid item xs={6}>
      </Grid>
    </Grid>
    <Box mt={2} style={{maxHeight: "100%"}}>
      <APIWordNotesProvider>
        <WordsTable />
      </APIWordNotesProvider>
    </Box>
  </div>
}

export default ManageWordsView