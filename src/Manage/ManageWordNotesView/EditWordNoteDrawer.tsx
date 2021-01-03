import React, { useEffect, useState} from "react";
import {Box, Button, Dialog, TextField, Typography} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {useFormik} from "formik";
import Select from "react-select-material-ui";
import {DrawerBase} from "../../General/Drawers/DrawerBase"
import {WordsTable} from "../../General/WordsTable/WordsTable";
import {APIWordNoteType} from "../../API/APIWordNote";
import {APIWordType, retrieveAPIWords} from "../../API/APIWord";
import {APICategoryType, retrieveAPICategories} from "../../API/APICategory";
import {ContentEditor} from "../../General/Dialogs/ContentEditor";
import {WordNoteContentPreview} from "../../General/Dialogs/WordNoteContentPreview";
import {H6} from "../../General/Components/Headers";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    editor: {
      "& .MuiFormControl-root": {
        margin: theme.spacing(2)
      }
    }
  })
)

type WordPickerProps = {
  selectedWords: (APIWordType|undefined)[],
  onClose: (words: APIWordType[]) => void
}

const WordPicker: React.FC<WordPickerProps> = props => {
  // @ts-ignore
  const [wordsSelected, setWordsSelected] = useState<APIWordType[]>(props.selectedWords.filter(word => word !== undefined))

  const onSelect = (word: APIWordType) => {
    if (!wordsSelected.includes(word)) {
      setWordsSelected([...wordsSelected, word]);
    }
  }
  const onRemove = (word: APIWordType) => {
    const index = wordsSelected.indexOf(word);
    if (index !== -1) {
      const newWordsSelected = [...wordsSelected]
      newWordsSelected.splice(index, 1)
      setWordsSelected(newWordsSelected)
    }
  }
  const onSave = () => {
    props.onClose(wordsSelected)
  }
  const onClose = () => {
    // @ts-ignore
    props.onClose(props.selectedWords.filter(word => word))
  }
  return <Box>
    <Box mx={3} my={1} style={{border: "1px solid darkgray", borderRadius: 25, minHeight: 100, padding: 10}}>
      <Typography variant={"body1"} display={"inline"}>
        {wordsSelected.map(word => {
          return <><span>{`${word.kana} (${word.uuid}) `}</span><span onClick={()=>onRemove(word)}>[x]</span>, </>
        })}
      </Typography>
    </Box>
    <Box display={"flex"} justifyContent={"center"}>
      <Button variant={"outlined"} color={"primary"} onClick={onSave}>Save</Button>
      <Button variant={"outlined"} onClick={onClose}>Close</Button>
    </Box>
    <WordsTable
      actionButtons={[
        {buttonName: "Add", action: onSelect}
      ]}
    />
  </Box>
}

type EditorProps = {
  wordNote: APIWordNoteType
  createOrModifyWordNote: (wordNote: APIWordNoteType) => void,
  onClose: () => void
}

export const WordNoteEditor: React.FC<EditorProps> = props => {
  const classes = useStyles()
  const [isContentEditorOpen, setIsContentEditorOpen] = useState(false)
  const [isWordPickerOpen, setIsWordPickerOpen] = useState(false)

  const [categoriesData, setCategoriesData] = useState<APICategoryType[]>([])
  const loadCategoriesData = () => {
    retrieveAPICategories()
      .then(data => setCategoriesData(data))
      .catch(err => console.log(err))
  }
  useEffect(() => {
    loadCategoriesData()
  }, [])

  const [wordsData, setWordsData] = useState<APIWordType[]>([])
  const loadWordsData = () => {
    retrieveAPIWords()
      .then(data => setWordsData(data))
      .catch(err => console.log(err))
  }
  useEffect(() => {
    loadWordsData()
  }, [])
  const formik = useFormik({
    initialValues: props.wordNote,
    onSubmit: ()=>{
      props.createOrModifyWordNote(formik.values);
      props.onClose()
    }
  });
  const categoryOptions = categoriesData.map(category => ({value: category.uuid, label: category.name}));
  const handleCategoryChange = (values: any[]) => {
    formik.setFieldValue("associated_categories", values? values: [])
  }
  const handleWordPickerClose = (words: APIWordType[]) => {
    formik.setFieldValue("associated_words", words.map(word => word.uuid).sort())
    setIsWordPickerOpen(false);
  }
  const handleContentEditorClose = (content: string) => {
    formik.setFieldValue("content", content)
    setIsContentEditorOpen(false)
  }
  return <form onSubmit={formik.handleSubmit} className={classes.editor}>
    <Box style={{borderLeft: "5px solid lightgray", paddingLeft: 10}} ml={1}>
      <Typography variant={"h6"}>Edit a word note</Typography>
    </Box>
    <TextField fullWidth={true} label={"UUID"} placeholder={"uuid"} value={props.wordNote.uuid} disabled={true} />
    <TextField
      fullWidth={true} label={"Title"} name={"title"} placeholder={"title"} value={formik.values.title}
      onChange={formik.handleChange} error={!!formik.errors.title} helperText={formik.errors.title} autoComplete={"off"}
    />
    <Box ml={1}>
      <Button style={{textTransform: "none"}} onClick={()=>setIsWordPickerOpen(true)}><Typography variant={"body1"} display={"inline"}>Associated words: {formik.values.associated_words? formik.values.associated_words.length: 0}</Typography></Button>
      <div>
        {formik.values.associated_words && formik.values.associated_words.map(wordUUID => {
          const word = wordsData.find(wordDatum => wordDatum.uuid === wordUUID)
          if (word) {
            return <Typography variant={"body2"}>{`${word.kana} (${word.uuid})`}</Typography>
          } else {
            return <Typography variant={"body2"}>INVALID REFERENCE</Typography>
          }
        })}
      </div>
    </Box>
    <Select
      SelectProps={{isMulti: true}} options={categoryOptions} onChange={handleCategoryChange} name={"associated_categories"} label={"Associated Category"}
      fullWidth={true} values={formik.values.associated_categories} error={!!formik.errors.associated_categories} helperText={formik.errors.associated_categories}
    />
    <Box style={{fontSize: 14}} m={2} onClick={()=>setIsContentEditorOpen(true)}>
      <H6>Content</H6>
      {formik.values.content
        ? <WordNoteContentPreview content={formik.values.content} />
        : "WRITE CONTENT"
      }
      </Box>
    <Dialog open={isWordPickerOpen} fullScreen={true}>
      <WordPicker
        onClose={handleWordPickerClose}
        selectedWords={formik.values.associated_words? formik.values.associated_words.map(associatedWordUUID => {
          return wordsData.find(wordDatum => wordDatum.uuid === associatedWordUUID)
        }): []}
      />
    </Dialog>
    <Dialog open={isContentEditorOpen} fullScreen={true}>
      <ContentEditor
        onClose={()=>setIsContentEditorOpen(false)}
        onSave={handleContentEditorClose}
        wordNote={props.wordNote}
      />
    </Dialog>
    <Box display={"flex"} justifyContent={"center"} mt={2}>
      <Button variant={"outlined"} color={"primary"} type={"submit"}>Save</Button>
    </Box>
  </form>
}

type EditWordDrawerProps = {
  onClose: () => void,
  isOpen: boolean,
  wordNote: APIWordNoteType,
  createOrModifyWordNote: (wordNote: APIWordNoteType) => void,
}

export const EditWordNoteDrawer: React.FC<EditWordDrawerProps> = props => {
  return <DrawerBase
    onClose={props.onClose}
    inside={<WordNoteEditor wordNote={props.wordNote} createOrModifyWordNote={props.createOrModifyWordNote} onClose={props.onClose}/>}
  />
}