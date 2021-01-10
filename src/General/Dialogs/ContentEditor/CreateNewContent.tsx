import React, {useState} from "react"

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"

import {MultipleLanguageSelector} from "./LanguageSelector"
import {Language} from "../../../data/Language"

type Props = {
  onClickCreateNew: (languages: Language[]) => void,
}

export const CreateNewContent: React.FC<Props> = props => {
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([])
  const onClickCreate = () => {
    props.onClickCreateNew(selectedLanguages)
  }
  const [isSelectingLanguages, setIsSelectingLanguages] = useState(false)

  return <Box>
    <IconButton onClick={()=>setIsSelectingLanguages(!isSelectingLanguages)}>
      <AddCircleOutlineIcon fontSize={"large"} />
    </IconButton>
    {isSelectingLanguages &&
      <Box display={"inline-flex"} flexDirection={"row-reverse"} mx={3}>
        <Button variant={"outlined"} disabled={selectedLanguages.length === 0} onClick={onClickCreate}>Create</Button>
        <Box style={{width: 300}} my={"auto"}>
          <MultipleLanguageSelector selected={["en"]} onSelect={setSelectedLanguages}/>
        </Box>
      </Box>
    }
  </Box>
}