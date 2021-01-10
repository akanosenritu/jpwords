import React, {useEffect, useState} from "react";
import {Box, Button, Dialog, TextField, Typography} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {useFormik} from "formik";
import Select from "react-select-material-ui";
import {DrawerBase} from "../../General/Drawers/DrawerBase"
import {WordsTable} from "../../General/WordsTable/WordsTable";
import {APIWordNoteType} from "../../API/APIWordNote";
import {APIWordType} from "../../API/APIWord";
import {APICategoryType, retrieveAPICategories} from "../../API/APICategory";
import {ContentEditor} from "../../General/Dialogs/ContentEditor";
import {H6} from "../../General/Components/Headers"
import {ConfirmDelete} from "../../General/Components/ConfirmDelete"

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
  selectedWords: APIWordType[],
  onClose: (words: APIWordType[]) => void
}

const WordPicker: React.FC<WordPickerProps> = props => {
  const [wordsSelected, setWordsSelected] = useState<APIWordType[]>(props.selectedWords)

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
    props.onClose(props.selectedWords)
  }
  return <Box>
    <Box mx={3} my={1} style={{border: "1px solid darkgray", borderRadius: 25, minHeight: 100, padding: 10}}>
      <Typography variant={"body1"} display={"inline"}>
        {wordsSelected.map(word => {
          return <><span>{`${word.kana} (${word.uuid}) `}</span><span onClick={() => onRemove(word)}>[x]</span>, </>
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

  const formik = useFormik({
    initialValues: props.wordNote,
    onSubmit: () => {
      props.createOrModifyWordNote(formik.values);
      props.onClose()
    }
  });
  const categoryOptions = categoriesData.map(category => ({value: category.uuid, label: category.name}));
  const handleCategoryChange = (values: any[]) => {
    formik.setFieldValue("associated_categories", values ? values : [])
  }
  const handleWordPickerClose = (words: APIWordType[]) => {
    formik.setFieldValue("associated_words", words.sort())
    setIsWordPickerOpen(false);
  }

  return <form onSubmit={formik.handleSubmit} className={classes.editor}>
    <H6>Edit word note</H6>
    <Box>
      <TextField fullWidth label={"UUID"} placeholder={"uuid"} value={props.wordNote.uuid} disabled={true}/>
      <TextField
        fullWidth={true} label={"Title"} name={"title"} placeholder={"title"} value={formik.values.title}
        onChange={formik.handleChange} error={!!formik.errors.title} helperText={formik.errors.title} autoComplete={"off"}
      />
      <Box ml={1}>
        <Button style={{textTransform: "none"}} onClick={() => setIsWordPickerOpen(true)}><Typography variant={"body1"}
                                                                                                      display={"inline"}>Associated
          words: {formik.values.associated_words ? formik.values.associated_words.length : 0}</Typography></Button>
        <div>
          {formik.values.associated_words.map(word => {
            return <Typography variant={"body2"}>{`${word.kana} (${word.uuid})`}</Typography>
          })}
        </div>
      </Box>
      <Select
        SelectProps={{isMulti: true}} options={categoryOptions} onChange={handleCategoryChange}
        name={"associated_categories"} label={"Associated Category"}
        fullWidth={true} values={formik.values.associated_categories} error={!!formik.errors.associated_categories}
        helperText={formik.errors.associated_categories}
      />
      <Box mt={2} ml={2} onClick={() => setIsContentEditorOpen(true)} role={"button"}>
        <Typography variant={"subtitle1"}>Edit content from here</Typography>
      </Box>
    </Box>
    <Dialog open={isWordPickerOpen} fullScreen={true}>
      <WordPicker
        onClose={handleWordPickerClose}
        selectedWords={formik.values.associated_words}
      />
    </Dialog>
    <Dialog open={isContentEditorOpen} fullScreen={true}>
      <ContentEditor
        onClose={() => setIsContentEditorOpen(false)}
        wordNote={props.wordNote}
      />
    </Dialog>
    <Box display={"flex"} justifyContent={"center"} mt={2}>
      <Button variant={"outlined"} color={"primary"} type={"submit"}>Save</Button>
    </Box>
    <Box mt={2}>
      <H6>Delete word note</H6>
      <ConfirmDelete
        validator={text => text === props.wordNote.uuid}
        helperText={"Input word note uuid to confirm deletion."}
      />
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
    inside={<WordNoteEditor wordNote={props.wordNote} createOrModifyWordNote={props.createOrModifyWordNote}
                            onClose={props.onClose}/>}
  />
}