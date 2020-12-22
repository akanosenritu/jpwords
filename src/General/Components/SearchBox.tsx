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
  onSearch: (searchQuery: string, searchBy: string) => void;
  searchBy: string,
  query: string
}

const searchByCandidates = [
  "uuid",
  "kana",
  "kanji",
  "meaning",
  "category",
]

export const SearchBox: React.FC<SearchBoxProps> = (props) => {
  const classes = useStyles();
  const formik = useFormik({
    initialValues: {
      query: props.query,
      searchBy: props.searchBy
    },
    onSubmit: (values) => {
      if (!values.query) return
      props.onSearch(values.query.trim(), values.searchBy)
    }
  })
  return <Paper component={"div"} className={classes.searchBox}>
    <form onSubmit={formik.handleSubmit} style={{display: "flex"}}>
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
