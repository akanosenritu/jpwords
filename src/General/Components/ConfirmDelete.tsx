import React, {ChangeEvent, useState} from "react"

import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"

type Props = {
  validator: (text: string) => boolean,
  helperText: string
}
export const ConfirmDelete: React.FC<Props> = props => {
  const [text, setText] = useState("")
  const onChange = (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setText(event.target.value)
  }
  return <Box>
    <TextField
      fullWidth={true}
      helperText={props.helperText}
      label={"UUID"}
      onChange={onChange}
      placeholder={"uuid"}
      value={text}
    />
    <Box display={"flex"} justifyContent={"center"}>
      <Button variant={"outlined"} color={"secondary"} disabled={!props.validator(text)}>Delete</Button>
    </Box>
  </Box>
}