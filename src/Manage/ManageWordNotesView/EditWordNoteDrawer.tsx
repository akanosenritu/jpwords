import React, {ChangeEvent, useState} from "react";
import {Box, Button, Dialog, Grid, TextField, Typography} from "@material-ui/core";
import {availableWords, categoryList, WordType} from "../../data/Word/Word";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {FormikErrors, useFormik} from "formik";
import Select from "react-select-material-ui";
import {DrawerBase} from "../DrawerBase";
import {WordNote, WordNoteType} from "../../data/WordNotes/WordNote";
import ReactMarkDown from "react-markdown";
import {PrintMarkDown} from "../../General/Components/PrintMarkDown";
import {WordsTable} from "../ManageWordsView/WordsTable";

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
  selectedWords: WordType[],
  onClose: (words: WordType[]) => void
}

const WordPicker: React.FC<WordPickerProps> = props => {
  const [wordsSelected, setWordsSelected] = useState<WordType[]>(props.selectedWords)
  const onSelect = (word: WordType) => {
    if (!wordsSelected.includes(word)) {
      setWordsSelected([...wordsSelected, word]);
    }
  }
  const onRemove = (word: WordType) => {
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
  const onReload = () => {
    setWordsSelected(props.selectedWords)
  }
  const onClose = () => {
    props.onClose(props.selectedWords)
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
      <Button variant={"outlined"} color={"secondary"} onClick={onReload}>Reload</Button>
      <Button variant={"outlined"} onClick={onClose}>Close</Button>
    </Box>
    <WordsTable words={Object.values(availableWords)} actionButtons={[
      {buttonName: "ADD", action: (word) => onSelect(word)}
    ]} />
  </Box>
}

type ContentEditorProps = {
  content: string,
  onSave: (newContent: string) => void,
  onClose: ()=>void,
  wordNote: WordNoteType
}

export const ContentEditor: React.FC<ContentEditorProps> = props => {
  const [content, setContent] = useState(props.content);

  return <Box m={1}>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box display={"flex"} justifyContent={"center"} mt={2}>
          <Button color={"primary"} variant={"contained"} onClick={()=>{props.onSave(content);props.onClose()}}>Save</Button>
          <Button color={"secondary"} variant={"contained"} onClick={()=>setContent(props.content)}>Reload</Button>
          <Button variant={"contained"} onClick={()=>props.onClose()}>Close</Button>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box ml={3} mr={1} fontSize={20}>
          <PrintMarkDown content={content} />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box mr={3} style={{fontSize: 20}}>
          <TextField
            multiline={true} onChange={(event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setContent(event.target.value)}
            value={content} variant={"outlined"} fullWidth
          />
        </Box>
      </Grid>
    </Grid>
  </Box>
}

type EditorProps = {
  wordNote: WordNoteType
  createOrModifyWordNote: (wordNote: WordNoteType) => void,
  onClose: () => void
}

const Editor: React.FC<EditorProps> = props => {
  const classes = useStyles();
  const [isContentEditorOpen, setIsContentEditorOpen] = useState(false);
  const [isWordPickerOpen, setIsWordPickerOpen] = useState(false)
  const formik = useFormik({
    initialValues: props.wordNote,
    validate: (values) => {
      console.log("validating...")
      const errors: FormikErrors<WordType> = {};
    },
    onSubmit: ()=>{
      props.createOrModifyWordNote(formik.values);
      props.onClose()
    }
  });
  const onContentSave = (newContent: string) => {
    formik.setFieldValue("content", newContent);
  }
  const categoryOptions = categoryList.map(category => ({value: category as string, label: category as string}));
  const handleCategoryChange = (values: any[]) => {
    formik.setFieldValue("associatedCategories", values? values: [])
  }
  const handleWordPickerClose = (words: WordType[]) => {
    formik.setFieldValue("associatedWords", words.map(word => word.uuid).sort())
    setIsWordPickerOpen(false);
  }
  return <form onSubmit={formik.handleSubmit} className={classes.editor}>
    <Box style={{borderLeft: "5px solid lightgray", paddingLeft: 10}} ml={1}>
      <Typography variant={"h6"}>Edit a word note</Typography>
    </Box>
    <TextField fullWidth={true} label={"UUID"} placeholder={"uuid"} value={props.wordNote.id} disabled={true} />
    <TextField
      fullWidth={true} label={"Title"} name={"title"} placeholder={"title"} value={formik.values.title}
      onChange={formik.handleChange} error={!!formik.errors.title} helperText={formik.errors.title} autoComplete={"off"}
    />
    <Box m={2}>
      <Button style={{textTransform: "none"}} onClick={()=>setIsWordPickerOpen(true)}><Typography variant={"body1"} display={"inline"}>Associated words: {formik.values.associatedWords? formik.values.associatedWords.length: 0}</Typography></Button>
      <div>
        {formik.values.associatedWords && formik.values.associatedWords.map(wordUUID => {
          if (availableWords[wordUUID]) {
            const word = availableWords[wordUUID]
            return <Typography variant={"body2"}>{`${word.kana} (${word.uuid})`}</Typography>
          } else {
            return <Typography variant={"body2"}>INVALID REFERENCE</Typography>
          }
        })}
      </div>
    </Box>
    <Select
      SelectProps={{isMulti: true}} options={categoryOptions} onChange={handleCategoryChange} name={"associatedCategories"} label={"Associated Category"}
      fullWidth={true} values={formik.values.associatedCategories} error={!!formik.errors.associatedCategories} helperText={formik.errors.associatedCategories}
    />
    <TextField
      fullWidth={true} label={"Description"} name={"description"} placeholder={"description"} value={formik.values.description}
      multiline={true}
      onChange={formik.handleChange} error={!!formik.errors.description} helperText={formik.errors.description} autoComplete={"off"}
    />
    <Box style={{fontSize: 14}} m={2} onClick={()=>setIsContentEditorOpen(true)}>
      <ReactMarkDown>{formik.values.content ? formik.values.content: "NO CONTENT. PLEASE ADD IT."}</ReactMarkDown>
    </Box>
    <Dialog open={isContentEditorOpen} fullScreen={true}>
      <ContentEditor
        content={formik.values.content} onSave={onContentSave} onClose={()=>setIsContentEditorOpen(false)}
        wordNote={formik.values as WordNoteType}
      />
    </Dialog>
    <Dialog open={isWordPickerOpen} fullScreen={true}>
      <WordPicker
        onClose={handleWordPickerClose}
        selectedWords={formik.values.associatedWords? formik.values.associatedWords.map(associatedWord => {
          return availableWords[associatedWord]
        }).filter(word => word): []}
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
  wordNote: WordNoteType,
  createOrModifyWordNote: (wordNote: WordNoteType) => void,
}

export const EditWordNoteDrawer: React.FC<EditWordDrawerProps> = props => {
  return <DrawerBase
    isOpen={props.isOpen} onClose={props.onClose}
    inside={<Editor wordNote={props.wordNote} createOrModifyWordNote={props.createOrModifyWordNote} onClose={props.onClose}/>}
  />
}