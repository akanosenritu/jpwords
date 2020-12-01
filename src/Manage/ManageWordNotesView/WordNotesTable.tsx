import React from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from "@material-ui/core/TablePagination";
import {Button} from "@material-ui/core";
import {APIWordNoteType} from "../API/APIWordNote";

const COLUMNS = ["UUID", "Title", "A. Words", "A. Categories", "Actions"]

type WordNotesTableProps = {
  wordNotes: APIWordNoteType[],
  onClickOpenEditor: (wordNote: APIWordNoteType) => void
}

export const WordNotesTable: React.FC<WordNotesTableProps> = props => {
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
          <TableCell key={COLUMNS[0]} style={{width: 350}}>{COLUMNS[0]}</TableCell>
          {COLUMNS.slice(1).map(column => <TableCell key={column}>{column}</TableCell>)}
        </TableRow>
      </TableHead>
      <TableBody>
        {props.wordNotes.slice(page * rowsPerPage, page*rowsPerPage+rowsPerPage).map(wordNote => (
          <TableRow key={wordNote.uuid}>
            <TableCell>{wordNote.uuid}</TableCell>
            <TableCell>{wordNote.title}</TableCell>
            <TableCell>{wordNote.associatedWords? wordNote.associatedWords.length: 0}</TableCell>
            <TableCell>{wordNote.associatedCategories? wordNote.associatedCategories.length: 0}</TableCell>
            <TableCell>
              <Button style={{padding: 0}} size={"small"} onClick={() => props.onClickOpenEditor(wordNote)}>EDIT</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TablePagination
        style={{width: 500}}
        component="div"
        count={props.wordNotes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Table>
  </TableContainer>
}