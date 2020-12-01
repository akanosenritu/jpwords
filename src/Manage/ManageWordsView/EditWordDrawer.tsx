import React, {useEffect, useState} from "react";
import {Box, Button, TextField, Typography} from "@material-ui/core";
import {categoryList} from "../../data/Word/Word";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {FormikErrors, useFormik} from "formik";
import * as wanakana from "wanakana";
import Select from "react-select-material-ui";
import {DrawerBase} from "../DrawerBase";
import {APIWordType} from "../API/APIWord";
import {APICategoryType, retrieveAPICategories} from "../API/APICategory";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    editor: {
      "& .MuiFormControl-root": {
         margin: theme.spacing(2)
      }
    }
  })
)

type EditorProps = {
  word: APIWordType
  createOrModifyWord: (word: APIWordType) => void,
  onClose: () => void
}

const Editor: React.FC<EditorProps> = props => {
  const classes = useStyles();

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
    initialValues: props.word,
    validate: (values) => {
      const errors: FormikErrors<APIWordType> = {};
      if (values.kana === "") {
        errors.kana = "Kana must not be empty."
      } else if (!wanakana.isHiragana(values.kana)) {
        errors.kana = "The inputted Kana is not in Hiragana."
      }
      if (values.meaning === "") {
        errors.meaning = "Meaning must not be empty."
      }
      if (values.category.length === 0) {
        errors.category = "At least one category must be set."
      }
      return errors
    },
    onSubmit: ()=>{
      props.createOrModifyWord(formik.values);
      props.onClose()
    }
  });
  const categoryOptions = categoriesData.map(category => ({value: category.uuid, label: category.name}));
  const handleCategoryChange = (values: any[]) => {
    formik.setFieldValue("category", values? values: [])
  }
  return <form onSubmit={formik.handleSubmit} className={classes.editor}>
    <Box style={{borderLeft: "5px solid lightgray", paddingLeft: 10}} ml={1}>
      <Typography variant={"h6"}>Edit a word</Typography>
    </Box>
    <TextField fullWidth={true} label={"UUID"} placeholder={"uuid"} value={props.word.uuid} disabled={true} />
    <TextField
      fullWidth={true} label={"Kanji"} name={"kanji"} placeholder={"kanji"} value={formik.values.kanji}
      onChange={formik.handleChange} error={!!formik.errors.kanji} helperText={formik.errors.kanji} autoComplete={"off"}
    />
    <TextField
      fullWidth={true} label={"Kana"} name={"kana"} placeholder={"kana"} value={formik.values.kana}
      onChange={formik.handleChange} error={!!formik.errors.kana} helperText={formik.errors.kana} autoComplete={"off"}
    />
    <Select
      SelectProps={{isMulti: true}} options={categoryOptions} onChange={handleCategoryChange} name={"category"} label={"Category"}
      fullWidth={true} values={formik.values.category} error={!!formik.errors.category} helperText={formik.errors.category}
    />
    <TextField
      fullWidth={true} label={"Meaning"} name={"meaning"} placeholder={"meaning"} value={formik.values.meaning}
      onChange={formik.handleChange} error={!!formik.errors.meaning} helperText={formik.errors.meaning} autoComplete={"off"}
    />
    <Box display={"flex"} justifyContent={"center"} mt={2}>
      <Button variant={"outlined"} color={"primary"} type={"submit"}>Save</Button>
    </Box>
  </form>
}

type EditWordDrawerProps = {
  onClose: () => void,
  isOpen: boolean,
  word: APIWordType,
  createOrModifyWord: (word: APIWordType) => void,
}

export const EditWordDrawer: React.FC<EditWordDrawerProps> = props => {
  return <DrawerBase
    isOpen={props.isOpen} onClose={props.onClose}
    inside={<Editor word={props.word} createOrModifyWord={props.createOrModifyWord} onClose={props.onClose} />}
  />
}