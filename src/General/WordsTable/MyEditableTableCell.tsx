import React from "react";
import TableCell from '@material-ui/core/TableCell';
import {useFormik} from "formik";
import {Input} from "@material-ui/core";

type Props = {
  children: string,
  onSave: (value: string) => void
}

//  TableCell component that show a button to copy the text inside when clicked.
export const MyEditableTableCell: React.FC<Props> = (props) => {
  const formik = useFormik({
    initialValues: {
      value: props.children
    },
    onSubmit: (values) => props.onSave(values.value)
  })
  return <TableCell>
    <form onSubmit={formik.handleSubmit}>
      <Input
        value={formik.values.value}
        autoComplete={"off"}
        disableUnderline={true}
        name={"value"}
        onChange={formik.handleChange}
        fullWidth={true}
        onBlur={()=>formik.handleSubmit()}
      />
    </form>
  </TableCell>
}