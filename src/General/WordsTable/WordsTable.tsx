import React, {useCallback, useEffect, useState} from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from "@material-ui/core/TablePagination";
import {Button, Box} from "@material-ui/core";
import {SearchBox} from "./SearchBox";
import {APIWordType, deleteAPIWord, getMeaning, retrieveAPIWordsWithPagination, updateAPIWord} from "../../API/APIWord";
import {APICategoryType, retrieveAPICategories} from "../../API/APICategory";
import {APIWordListType, isWordUsedInWordList, retrieveAPIWordLists} from "../../API/APIWordList";
import {MyTableCell} from "./MyTableCell";
import {initialConfigurations, useConfigurations} from "../../LocalStorage/Configurations";
import {MyEditableTableCell} from "./MyEditableTableCell";
import {createTranslation, updateTranslation} from "../../API/APITranslation";
import {Editor} from "../Drawers/Editor";
import {DrawerBase, DrawerBaseProps} from "../Drawers/DrawerBase";
import {Remover} from "../Drawers/Remover";
import {WordsTableWordNotesCell} from "./WordsTableWordNotesCell";

const columns = ["UUID", "Kanji", "Kana", "Meaning", "Category", "Lists", "WordNotes", "Actions"]

type WordsTableProps = {
  actionButtons?: {
    buttonName: string,
    action: (word: APIWordType) => void
  }[]
}

export const WordsTable: React.FC<WordsTableProps> = props => {
  const {configurations} = useConfigurations(initialConfigurations)

  // category data
  const [categoriesDict, setCategoriesDict] = useState<{[uuid: string]: APICategoryType}|null>(null)
  const [categoryData, setCategoryData] = useState<APICategoryType[]>([])
  const loadCategoriesData = () => {
    retrieveAPICategories()
      .then(data => {
        setCategoryData(data)
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

  // word lists data
  const [wordLists, setWordLists] = useState<APIWordListType[]>([])
  const loadWordListsData = () => {
    retrieveAPIWordLists()
      .then(data => {
        setWordLists(data)
      })
  }
  useEffect(() => {
    loadWordListsData()
  }, [])

  // handle edits
  const handleMeaningEdit = async (word: APIWordType, value: string) => {
    const language = configurations.language

    // if the word already has a translation for the language
    // if it doesn't create a new one
    const translation = word.meaning.find(t => t.language === language)
    if (!translation) {
      const creationResult = await createTranslation(language, value)
      // the creation succeeds, reload data
      if (creationResult.status === "success") {
        updateWord({...word, meaning: word.meaning.concat([creationResult.translation])})
      }
    } else {
      const updateResult = await updateTranslation({...translation, text: value})
      if (updateResult.status === "success") {
        const updatedTranslation = updateResult.translation
        const index = word.meaning.findIndex(translation => translation.uuid === updatedTranslation.uuid)
        const newMeaning = [...word.meaning]
        newMeaning[index] = updatedTranslation
        updateWord({...word, meaning: newMeaning})
      }
    }
  }

  // pagination
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 100;
  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // search
  const [query, setQuery] = useState<Map<string, string>>(new Map());
  const onSearch = (query: Map<string, string>) => {
    setQuery(query)
  }

  // words data
  const [words, setWords] = useState<APIWordType[]>([])
  const [total, setTotal] = useState(0)

  // load pages
  const loadData = useCallback(async () => {
    const params = new Map<string, string>([
      ["limit", `${rowsPerPage}`],
      ["offset", `${rowsPerPage*page}`],
      ...Array.from(query.entries())
    ])
    return retrieveAPIWordsWithPagination(params)
      .then(result => {
        if (result.status === "success") {
          setWords(result.words)
          setTotal(result.total)
        }
      })
  }, [rowsPerPage, page, query])
  useEffect(() => {
    loadData()
  }, [loadData])

  // update a word
  const updateWord = async (word: APIWordType) => {
    setRowStatusUpdating(word)
    const updateResult = await updateAPIWord(word)
    if (updateResult.status === "success") {
      const updatedWord = updateResult.word
      setWords(words => {
        const index = words.findIndex(word => word.uuid === updatedWord.uuid)
        // this should not happen
        if (index === -1) return words
        const newWords = [...words]
        newWords[index] = updatedWord
        return newWords
      })
      setRowStatusUpdated(word)
    } else {
      setRowStatusFailed(word)
    }
  }

  // delete a word
  const deleteWord = async (word: APIWordType, replaceToUUID?: string) => {
    setRowStatusUpdating(word)
    const deleteResult = await deleteAPIWord(word, replaceToUUID)
    if (deleteResult.status === "success") {
      await loadData()
      setRowStatusNone(word)
    } else {
      setRowStatusFailed(word)
    }
  }

  // drawers
  const [drawer, setDrawer] = useState<React.ReactElement<DrawerBaseProps>|null>(null)
  const handleDrawerClose = () => setDrawer(null)
  const onClickOpenEditor = (word: APIWordType) => {
    setDrawer(<DrawerBase
      onClose={handleDrawerClose}
      inside={<Editor
        word={word}
        createOrModifyWord={updateWord}
        onClose={handleDrawerClose}
        categoryData={categoryData}
      />}
    />)
  }
  const onClickOpenRemover = (word: APIWordType) => {
    setDrawer(<DrawerBase
      onClose={handleDrawerClose}
      inside={<Remover
        word={word} deleteWord={deleteWord} onClose={handleDrawerClose}
      />}
    />)
  }

  // row status
  type RowStatus = "Updated" | "Updating" | "None" | "Failed"
  type RowStatuses = {
    [wordUUID: string]: {
      status: RowStatus,
      setTimeoutID: number | null
    }
  }
  const [rowStatuses, setRowStatuses] = useState<RowStatuses>({})
  const setRowStatusUpdating = (word: APIWordType) => {
    setRowStatuses(rowStatuses => {
      if (rowStatuses[word.uuid]) {
        const timeOutID = rowStatuses[word.uuid].setTimeoutID
        if (timeOutID) window.clearTimeout(timeOutID)
      }
      return {...rowStatuses, [word.uuid]: {
        status: "Updating",
        setTimeoutID: null
      }}
    })
  }
  const setRowStatusUpdated = (word: APIWordType) => {
    setRowStatuses(rowStatuses => {
      if (rowStatuses[word.uuid]) {
        const timeOutID = rowStatuses[word.uuid].setTimeoutID
        if (timeOutID) window.clearTimeout(timeOutID)
      }
      return {...rowStatuses, [word.uuid]: {
        status: "Updated",
        setTimeoutID: window.setTimeout(()=>setRowStatusNone(word), 1000)
      }}
    })
  }
  const setRowStatusNone = (word: APIWordType) => {
    setRowStatuses(rowStatuses => {
      return {...rowStatuses, [word.uuid]: {
        status: "None",
        setTimeoutID: null
      }}
    })
  }
  const setRowStatusFailed = (word: APIWordType) => {
    setRowStatuses(rowStatuses => {
      if (rowStatuses[word.uuid]) {
        const timeOutID = rowStatuses[word.uuid].setTimeoutID
        if (timeOutID) clearTimeout(timeOutID)
      }
      return {...rowStatuses, [word.uuid]: {
          status: "Failed",
          setTimeoutID: window.setTimeout(()=>setRowStatusNone(word), 1000)
        }}
    })
  }
  const getRowColor = (word: APIWordType) => {
    const rowStatus = rowStatuses[word.uuid]? rowStatuses[word.uuid].status: ""
    switch (rowStatus) {
      case "Updated":
        return "#d6f5d6"
      case "Updating":
        return "#ffffcc"
      case "Failed":
        return "#ffebe6"
      default:
        return "#ffffff"
    }
  }

  // actions
  const getActions = (word: APIWordType) => {
    if (props.actionButtons) return props.actionButtons.map(btn => <Button key={btn.buttonName} onClick={()=>btn.action(word)}>{btn.buttonName}</Button>)
    return <>
      <Button key={"edit"} style={{padding: 0}} size={"small"} onClick={() => onClickOpenEditor(word)}>
        Edit
      </Button>
      <Button key={"delete"} style={{padding: 0}} size={"small"} onClick={()=>onClickOpenRemover(word)}>
        Delete
      </Button>
    </>
  }

  return <Box>
    <Box display={"flex"} justifyContent={"center"} mb={2}>
      <SearchBox onSearch={onSearch} />
    </Box>
    <TablePagination
      style={{width: 500, marginLeft: "auto", marginRight: 0}}
      component="div"
      count={total}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={handlePageChange}
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
          {words.map(word => {
            const meaning = getMeaning(word, configurations.language)
            const category = categoriesDict? word.category.map((categoryUUID: string | number) => categoriesDict[categoryUUID].name).join(", "): ""
            const wordList = wordLists.filter(wordList => isWordUsedInWordList(word.uuid, wordList)).map(wordList => wordList.name).join(", ")
            return <TableRow key={word.uuid} style={{backgroundColor: getRowColor(word), transition: "background-color 0.5s ease-out"}}>
              <MyTableCell key={"uuid"}>{word.uuid}</MyTableCell>
              <MyTableCell key={`kanji-${word.kanji}`}>
                {word.kanji}
              </MyTableCell>
              <MyTableCell key={`kana-${word.kana}`}>
                {word.kana}
              </MyTableCell>
              <MyEditableTableCell key={`meaning-${meaning}`} onSave={(value) => {handleMeaningEdit(word, value)}}>
                {meaning}
              </MyEditableTableCell>
              <TableCell key={`category-${category}`}>
                {category}
              </TableCell>
              <TableCell key={`wordList-${wordList}`}>
                {wordList}
              </TableCell>
              <WordsTableWordNotesCell word={word} />
              <TableCell key={"actions"}>
                {getActions(word)}
              </TableCell>
            </TableRow>
          })}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      style={{width: 500, marginLeft: "auto", marginRight: 0}}
      component="div"
      count={total}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={handlePageChange}
      rowsPerPageOptions={[100]}
    />
    {drawer && drawer}
  </Box>
}