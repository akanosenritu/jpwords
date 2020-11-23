import React from "react";
import {WordType} from "../data/Word";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from "@material-ui/core/TablePagination";
import {Button} from "@material-ui/core";

const columns = ["UUID", "Kanji", "Kana", "Meaning", "Category", "Actions"]

type WordsTableProps = {
  words: WordType[],
  onClickOpenEditor: (word: WordType) => void,
  onClickOpenInspector: (word: WordType) => void,
}

export const WordsTable: React.FC<WordsTableProps> = props => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return <TableContainer>
    <Table size={"small"} stickyHeader={true}>
      <TableHead>
        <TableRow>
          <TableCell key={columns[0]} style={{width: 350}}>{columns[0]}</TableCell>
          {columns.slice(1).map(column => <TableCell key={column}>{column}</TableCell>)}
        </TableRow>
      </TableHead>
      <TableBody>
        {props.words.slice(page * rowsPerPage, page*rowsPerPage+rowsPerPage).map(word => (
          <TableRow key={word.uuid}>
            <TableCell>{word.uuid}</TableCell>
            <TableCell>{word.kanji}</TableCell>
            <TableCell>{word.kana}</TableCell>
            <TableCell>{word.meaning}</TableCell>
            <TableCell>{word.category.join(",")}</TableCell>
            <TableCell>
              <Button style={{padding: 0}} size={"small"} onClick={() => props.onClickOpenEditor(word)}>EDIT</Button>
              <Button style={{padding: 0}} size={"small"} onClick={() => props.onClickOpenInspector(word)}>INSPECT</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TablePagination
        style={{width: 500}}
        component="div"
        count={props.words.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Table>
  </TableContainer>
}