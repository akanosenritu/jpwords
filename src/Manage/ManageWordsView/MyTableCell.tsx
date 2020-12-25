import React, {useState} from "react";
import TableCell from '@material-ui/core/TableCell';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import {IconButton} from "@material-ui/core";

type Props = {
  children: string
}

//  TableCell component that show copies the text inside when clicked.
export const MyTableCell: React.FC<Props> = (props) => {
  const [buttonIsShown, setButtonIsShown] = useState(false)
  const onClick = () => {
    setButtonIsShown(!buttonIsShown)
  }
  const onClickCopyButton = () => {
    navigator.clipboard.writeText(props.children)
      .then(() => {
        console.log("Copied text to the clipboard.")
        setButtonIsShown(false)
      })
  }
  return <TableCell onClick={onClick}>
    {props.children}
    {buttonIsShown &&
      <IconButton style={{margin: 0, padding: 0}} onClick={onClickCopyButton}>
        <FileCopyIcon />
      </IconButton>
    }
  </TableCell>
}