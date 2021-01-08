import React, {ChangeEvent} from "react"
import {createFilter} from "react-select"
import {Box, Button, TextField, Typography} from "@material-ui/core"
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles"
import {FormikErrors, useFormik} from "formik"
import * as wanakana from "wanakana"
import Select from "react-select-material-ui"
import {APIWordType, getMeaning} from "../../API/APIWord"
import {APICategoryType} from "../../API/APICategory"
import {Language, languages} from "../../data/Language";
import {APITranslation, createTranslation, updateTranslation} from "../../API/APITranslation";

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
  onClose: () => void,
  categoryData: APICategoryType[],

}

export const Editor: React.FC<EditorProps> = props => {
  const classes = useStyles();

  const formik = useFormik({
    initialValues: Object.assign(props.word, {
      meaningTranslations: Object.fromEntries(languages.map(language => [language, getMeaning(props.word, language)]))
    }),
    validate: (values) => {
      const errors: FormikErrors<APIWordType> = {};
      if (values.kana === "") {
        errors.kana = "Kana must not be empty."
      } else if (!Array.from(values.kana).map(letter => wanakana.isKana(letter) || letter === "～").reduce((acc, val) => acc && val)) {
        errors.kana = "Only Kanas and ～ are allowed here."
      }
      if (values.category.length === 0) {
        errors.category = "At least one category must be set."
      }
      return errors
    },
    onSubmit: async () =>{
      const newMeaning = await saveTranslations()
      props.createOrModifyWord({...formik.values, meaning: newMeaning});
      props.onClose()
    }
  });

  const categoryOptions = props.categoryData.map(category => ({value: category.uuid, label: category.name}));
  const handleCategoryChange = (values: any[]) => {
    formik.setFieldValue("category", values? values: [])
  }

  const handleMeaningChange = (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const language = event.target.name.replace("meaning-", "") as Language
    const newMeaningTranslations = {...formik.values.meaningTranslations}
    newMeaningTranslations[language] = event.target.value
    formik.setFieldValue("meaningTranslations", newMeaningTranslations)
  }
  const saveTranslations = async () => {
    const meaningTranslations = formik.values.meaningTranslations
    const newMeaning: APITranslation[] = []
    for (const language of languages) {
      const meaningTranslation = meaningTranslations[language]

      // if it is blank, skip it
      if (!meaningTranslation) continue

      // then check if a translation is already provided for the language
      // if not found, create a new one
      const index = props.word.meaning.findIndex(translation => translation.language === language)
      if (index === -1) {
        const creationResult = await createTranslation(language, meaningTranslation)
        if (creationResult.status === "success") newMeaning.push(creationResult.translation)
      }
      // if found, check if it has changed. if so, update it.
      else {
        const translation = props.word.meaning[index]
        if (translation.text === meaningTranslation) {
          newMeaning.push(translation)
        } else {
          translation.text = meaningTranslation
          const updateTranslationResult = await updateTranslation(translation)
          if (updateTranslationResult.status === "success") newMeaning.push(updateTranslationResult.translation)
        }
      }
    }
    return newMeaning
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
      SelectProps={{
        isMulti: true,
        filterOption: createFilter({matchFrom: "start"})
      }} options={categoryOptions} onChange={handleCategoryChange} name={"category"} label={"Category"}
      fullWidth={true} values={formik.values.category} error={!!formik.errors.category} helperText={formik.errors.category}
    />
    {languages.map(language => {
      return <TextField
        fullWidth={true} label={`Meaning (${language})`} name={`meaning-${language}`} placeholder={`meaning-${language}`} value={formik.values.meaningTranslations[language]}
        onChange={handleMeaningChange} error={!!formik.errors.meaning} helperText={formik.errors.meaning} autoComplete={"off"}
      />
    })}
    <Box display={"flex"} justifyContent={"center"} mt={2}>
      <Button variant={"outlined"} color={"primary"} type={"submit"}>Save</Button>
    </Box>
  </form>
}
