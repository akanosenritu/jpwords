import React from "react";
import {IconButton, InputBase, MenuItem, Paper, Select} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {useFormik} from "formik";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchBox: {
      display: "flex",
      alignItems: "center",
      width: 400
    },
    searchBoxInput: {
      marginLeft: theme.spacing(1)
    },
  })
)

type SearchBoxProps = {
  onSearch: (searchQuery: Map<string, string>) => void
}

const searchByCandidates = [
  "kana",
  "kanji",
  "meaning",
  "category",
  "wordList",
]

export const SearchBox: React.FC<SearchBoxProps> = (props) => {
  const classes = useStyles();
  const formik = useFormik({
    initialValues: {
      query: "",
      searchBy: "kanji"
    },
    onSubmit: (values) => {
      if (!values.query) return
      props.onSearch(new Map<string, string>([
        [values.searchBy, values.query.trim().replaceAll(" ", "_")]
      ]))
    }
  })

  return <Paper component={"div"} className={classes.searchBox}>
    <form onSubmit={formik.handleSubmit} style={{display: "flex", width: "100%"}}>
      <InputBase
        color={"primary"} fullWidth={true} className={classes.searchBoxInput} placeholder={"Search word"}
        onChange={formik.handleChange} value={formik.values.query} name={"query"} autoComplete={"off"}
      />
      <span>By</span>
      <Select style={{width: 100}} value={formik.values.searchBy} onChange={formik.handleChange} name={"searchBy"}>
        {searchByCandidates.map(searchByCandidate => {
          return <MenuItem key={searchByCandidate} value={searchByCandidate}>{searchByCandidate}</MenuItem>
        })}
      </Select>
      <IconButton type={"submit"}>
        <SearchIcon />
      </IconButton>
    </form>
  </Paper>
}
