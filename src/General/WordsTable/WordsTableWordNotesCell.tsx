import React, {useContext} from "react";
import TableCell from "@material-ui/core/TableCell";
import {APIWordType} from "../../API/APIWord";
import {APIWordNotesContext} from "../../API/APIWordNoteProvider";

type Props = {
  word: APIWordType
}

export const WordsTableWordNotesCell: React.FC<Props> = props => {
  const {getWordNotes} = useContext(APIWordNotesContext)
  const wordNotes = getWordNotes(props.word)
  return <TableCell key={`wordNotes-${wordNotes.length}`}>
    {wordNotes.length}
  </TableCell>
}