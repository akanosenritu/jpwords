import React, {useState} from "react";
import {WordType} from "../../data/Word";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from "@material-ui/core/TablePagination";
import {Button, Box} from "@material-ui/core";
import {SearchBox} from "../../General/Components/SearchBox";
import {searchWordInAvailableWordLists} from "../../data/WordList";

const columns = ["UUID", "Kanji", "Kana", "Meaning", "Category", "Word Lists", "Actions"]

type WordsTableProps = {
  words: WordType[],
  actionButtons: {
    buttonName: string,
    action: (word: WordType) => void
  }[]
}

export const WordsTable: React.FC<WordsTableProps> = props => {
  const [wordsShown, setWordsShown] = useState<{[wordUUID: string]: boolean}>(props.words.reduce((obj, word) => Object.assign(obj, {[word.uuid]: true}), {}));
  const [page, setPage] = React.useState(0);
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("meaning");
  const rowsPerPage = 25;
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const onSearch = (query: string, searchBy: string) => {
    setQuery(query)
    setSearchBy(searchBy)
    const re = new RegExp(query);
    let result: WordType[];
    if (["kana", "kanji", "meaning", "uuid"].includes(searchBy)) {
      // @ts-ignore
      result = props.words.filter(word => word[searchBy].search(re) !== -1)
    } else if (searchBy === "category") {
      result = props.words.filter(word => word.category.join(",").search(re) !== -1)
    } else {
      result = [];
    }
    setWordsShown(result.reduce((obj, word) => Object.assign(obj, {[word.uuid]: true}), {}))
    setPage(0);
  }
  console.log("table rendered.", new Date().toISOString(), wordsShown)
  return <Box>
    <Box display={"flex"} justifyContent={"center"} mb={2}>
      <SearchBox onSearch={onSearch} query={query} searchBy={searchBy}/>
    </Box>
    <TableContainer>
      <Table size={"small"} stickyHeader={true}>
        <TableHead>
          <TableRow>
            <TableCell key={columns[0]} style={{width: 350}}>{columns[0]}</TableCell>
            {columns.slice(1).map(column => <TableCell key={column}>{column}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.words.filter(word => wordsShown[word.uuid]).slice(page * rowsPerPage, page*rowsPerPage+rowsPerPage).map(word => (
            <TableRow key={word.uuid}>
              <TableCell key={word.uuid}>{word.uuid}</TableCell>
              <TableCell key={word.kanji}>{word.kanji}</TableCell>
              <TableCell key={word.kana}>{word.kana}</TableCell>
              <TableCell key={word.meaning}>{word.meaning}</TableCell>
              <TableCell key={word.category.join(", ")}>{word.category.join(",")}</TableCell>
              <TableCell key={"Word lists"}>{searchWordInAvailableWordLists(word).map(wordList => wordList.name).join(", ")}</TableCell>
              <TableCell>
                {props.actionButtons.map(actionButton => {
                  return <Button style={{padding: 0}} size={"small"} onClick={()=>actionButton.action(word)}>{actionButton.buttonName}</Button>
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TablePagination
          style={{width: 500, marginLeft: "auto", marginRight: 0}}
          component="div"
          count={props.words.filter(word => wordsShown[word.uuid]).length}
          rowsPerPage={25}
          page={page}
          onChangePage={handleChangePage}
          rowsPerPageOptions={[25]}
        />
      </Table>
    </TableContainer>
  </Box>
}