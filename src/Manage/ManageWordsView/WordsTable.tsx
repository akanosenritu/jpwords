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
import {MyTableCell} from "./MyTableCell";

const columns = ["UUID", "Kanji", "Kana", "Meaning", "Category", "Lists", "Actions"]

type WordsTableProps = {
  words: APIWordType[],
  actionButtons: {
    buttonName: string,
    action: (word: APIWordType) => void
  }[]
}

export const WordsTable: React.FC<WordsTableProps> = props => {
  const [hiddenWordUUIDs, setHiddenWordUUIDs] = useState<{[wordUUID: string]: boolean}>({});

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
    const newHiddenWordUUIDs: {[wordUUID: string]: boolean} = {};
    if (["kana", "kanji", "meaning", "uuid"].includes(searchBy)) {
      for (let i=0; i < props.words.length; i++) {
        const word = props.words[i]
        // @ts-ignore
        if (word[searchBy].search(re) === -1) {
          newHiddenWordUUIDs[word.uuid] = true
        }
      }
    } else if (searchBy === "category") {
      if (!categoriesDict) {
        console.log("search by category failed because no category data is present.")
        return
      }
      props.words.forEach(word => {
        newHiddenWordUUIDs[word.uuid] =
          word.category.map(cat => {
            const categoryName = categoriesDict[cat].name
            return categoryName.search(re) === -1
          })
            .every(bool => bool)
      })
    }
    setHiddenWordUUIDs(newHiddenWordUUIDs)
    setPage(0);
  }

  return <Box>
    <Box display={"flex"} justifyContent={"center"} mb={2}>
      <SearchBox onSearch={onSearch} query={query} searchBy={searchBy}/>
    </Box>
    <TablePagination
      style={{width: 500, marginLeft: "auto", marginRight: 0}}
      component="div"
      count={props.words.filter(word => !hiddenWordUUIDs[word.uuid]).length}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={handleChangePage}
      rowsPerPageOptions={[100]}
    />
    <TableContainer>
      <Table size={"small"} stickyHeader={true}>
        <TableHead>
          <TableRow>
            <TableCell key={columns[0]} style={{width: 350}}>{columns[0]}</TableCell>
            {columns.slice(1).map(column => <TableCell key={column}>{column}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.words.filter(word => !hiddenWordUUIDs[word.uuid]).slice(page * rowsPerPage, page*rowsPerPage+rowsPerPage).map(word => (
            <TableRow key={word.uuid}>
              <MyTableCell key={"uuid"}>{word.uuid}</MyTableCell>
              <MyTableCell key={"kanji"}>{word.kanji}</MyTableCell>
              <MyTableCell key={"kana"}>{word.kana}</MyTableCell>
              <MyTableCell key={"meaning"}>{word.meaning}</MyTableCell>
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
      </Table>
    </TableContainer>
    <TablePagination
      style={{width: 500, marginLeft: "auto", marginRight: 0}}
      component="div"
      count={props.words.filter(word => !hiddenWordUUIDs[word.uuid]).length}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={handleChangePage}
      rowsPerPageOptions={[100]}
    />
  </Box>
}