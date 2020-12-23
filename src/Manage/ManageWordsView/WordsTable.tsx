import React, {useEffect, useState} from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from "@material-ui/core/TablePagination";
import {Button, Box} from "@material-ui/core";
import {SearchBox} from "../../General/Components/SearchBox";
import {APIWordType} from "../../API/APIWord";
import {APICategoryType, retrieveAPICategories} from "../../API/APICategory";
import {APIWordListType, isWordUsedInWordList, retrieveAPIWordLists} from "../../API/APIWordList";

const columns = ["UUID", "Kanji", "Kana", "Meaning", "Category", "Lists", "Actions"]

type WordsTableProps = {
  words: APIWordType[],
  actionButtons: {
    buttonName: string,
    action: (word: APIWordType) => void
  }[]
}

export const WordsTable: React.FC<WordsTableProps> = props => {
  const [wordsShown, setWordsShown] = useState<{[wordUUID: string]: boolean}>(props.words.reduce((obj, word) => Object.assign(obj, {[word.uuid]: true}), {}));

  const [categoriesDict, setCategoriesDict] = useState<{[uuid: string]: APICategoryType}|null>(null)
  const loadCategoriesData = () => {
    retrieveAPICategories()
      .then(data => {
        const categoriesDict: {[uuid: string]: APICategoryType} = {}
        data.forEach(cat => {
          categoriesDict[cat.uuid] = cat
        })
        setCategoriesDict(categoriesDict)
      })
      .catch(err => console.log(err))
  }
  useEffect(() => {
    loadCategoriesData()
  }, [])

  const [wordLists, setWordLists] = useState<APIWordListType[]>([]);
  const loadWordListsData = () => {
    retrieveAPIWordLists()
      .then(data => {
        setWordLists(data)
      })
  }
  useEffect(() => {
    loadWordListsData()
  }, [])

  const [page, setPage] = React.useState(0);
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("kana");
  const rowsPerPage = 100;
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const onSearch = (query: string, searchBy: string) => {
    setQuery(query)
    setSearchBy(searchBy)
    const re = new RegExp(query);
    let result: APIWordType[];
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
              <TableCell key={"uuid"}>{word.uuid}</TableCell>
              <TableCell key={"kanji"}>{word.kanji}</TableCell>
              <TableCell key={"kana"}>{word.kana}</TableCell>
              <TableCell key={"meaning"}>{word.meaning}</TableCell>
              <TableCell key={"category"}>{categoriesDict && word.category.map((categoryUUID: string | number) => categoriesDict[categoryUUID].name).join(", ")}</TableCell>
              <TableCell key={"wordList"}>{wordLists.filter(wordList => isWordUsedInWordList(word.uuid, wordList)).map(wordList => wordList.name).join(", ")}</TableCell>
              <TableCell key={"actions"}>
                {props.actionButtons.map(actionButton => {
                  return <Button key={actionButton.buttonName} style={{padding: 0}} size={"small"} onClick={()=>actionButton.action(word)}>{actionButton.buttonName}</Button>
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TablePagination
          style={{width: 500, marginLeft: "auto", marginRight: 0}}
          component="div"
          count={props.words.filter(word => wordsShown[word.uuid]).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          rowsPerPageOptions={[100]}
        />
      </Table>
    </TableContainer>
  </Box>
}