import React, {useContext, useState} from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from "@material-ui/core/TablePagination";
import {Button} from "@material-ui/core";
import {APIWordNoteType} from "../../API/APIWordNote";
import {DrawerBase, DrawerBaseProps} from "../../General/Drawers/DrawerBase";
import {WordNoteEditor} from "./EditWordNoteDrawer";
import {APIWordNotesContext} from "../../API/APIWordNoteProvider";
import Box from "@material-ui/core/Box";

const COLUMNS = ["UUID", "Title", "A. Words", "A. Categories", "Actions"]

type WordNotesTableProps = {
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

  const {wordNotes, createWordNote, updateWordNote} = useContext(APIWordNotesContext)
  const createOrUpdateWordNote = (wordNote: APIWordNoteType) => {
    if (wordNote.uuid === "") return createWordNote(wordNote)
    return updateWordNote(wordNote)
  }

  // drawers
  const [drawer, setDrawer] = useState<React.ReactElement<DrawerBaseProps>|null>(null)
  const handleDrawerClose = () => setDrawer(null)
  const onClickOpenEditor = (wordNote: APIWordNoteType) => {
    setDrawer(<DrawerBase
      onClose={handleDrawerClose}
      inside={<WordNoteEditor wordNote={wordNote} createOrModifyWordNote={createOrUpdateWordNote} onClose={handleDrawerClose} />}
    />)
  }

  const onClickAddNewWordNote = () => {
    const blankWordNote: APIWordNoteType = {
      uuid: "",
      title: "",
      associated_categories: [] as string[],
      associated_words: [] as string[],
      is_published: false,
    }
    onClickOpenEditor(blankWordNote)
  };

  return <Box>
    <Box display={"flex"} justifyContent={"center"} mb={2}>
      <Button variant={"outlined"} onClick={onClickAddNewWordNote}>Add new word note</Button>
    </Box>
    <TablePagination
      style={{width: 500, marginLeft: "auto", marginRight: 0}}
      component="div"
      count={wordNotes.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    />
    <TableContainer>
      <Table size={"small"} stickyHeader={true}>
        <TableHead>
          <TableRow>
            <TableCell key={COLUMNS[0]} style={{width: 350}}>{COLUMNS[0]}</TableCell>
            {COLUMNS.slice(1).map(column => <TableCell key={column}>{column}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {wordNotes.slice(page * rowsPerPage, page*rowsPerPage+rowsPerPage).map(wordNote => (
            <TableRow key={wordNote.uuid}>
              <TableCell>{wordNote.uuid}</TableCell>
              <TableCell>{wordNote.title}</TableCell>
              <TableCell>{wordNote.associated_words.length}</TableCell>
              <TableCell>{wordNote.associated_categories.length}</TableCell>
              <TableCell>
                <Button style={{padding: 0}} size={"small"} onClick={() => onClickOpenEditor(wordNote)}>EDIT</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      style={{width: 500, marginLeft: "auto", marginRight: 0}}
      component="div"
      count={wordNotes.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    />
    {drawer}
  </Box>
}