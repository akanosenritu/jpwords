import React, {useRef, useState} from "react";
import {Box, Button, Typography} from "@material-ui/core";
import {useFormik} from "formik";
import TextField from "@material-ui/core/TextField";
import {DisplayWordWithFurigana, searchWords, WordType} from "../../data/Word";
import {WordList} from "../../data/WordList";

type WordCardProps = {
  word: WordType,
  onRemove: (index: number) => void,
  index: number
}

const WordCard: React.FC<WordCardProps> = (props) => {
  const onRemove = () => {
    props.onRemove(props.index)
  }
 return <div style={{border: "1px solid lightgray", borderRadius: 25, padding: 10, backgroundColor: "#f2f2f2"}}>
   <Typography variant={"h5"}>{props.index}: <DisplayWordWithFurigana word={props.word} />: {props.word.meaning}</Typography>
   <div style={{display: "flex"}}>
     <p>
       <Typography variant={"body2"}>{props.word.uuid}</Typography>
     </p>
     <Button size={"small"} color={"secondary"} onClick={onRemove}>Remove</Button>
   </div>
 </div>
}

export const CreateWordList: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      words: [] as WordType[],
      wordSpecifier: ""
    },
    onSubmit: (values) => {
      if (!formik.values.name || !formik.values.words || !formik.values.description) {
        alert("Invalid values");
        return
      }
      const wordList: WordList = {
        name: formik.values.name,
        words: formik.values.words,
        version: 1.0,
        description: formik.values.description,
        wordCount: formik.values.words.length
      }
      const blob = new Blob([JSON.stringify(wordList, null, 2)], {type: "application/json"});
      if (downloadLinkRef.current) {
        downloadLinkRef.current.download = `wordlist-${formik.values.name}.json`;
        downloadLinkRef.current.href = window.URL.createObjectURL(blob);
        setHasJsonGenerated(true);
      } else {
        alert("ref is null.")
      }
    }
  });
  const [hasJsonGenerated, setHasJsonGenerated] = useState(false);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const handleWordSpecifier = () => {
    const searchStrings = formik.values.wordSpecifier.split("　").filter(searchString => searchString);
    let result = formik.values.words;
    searchStrings.forEach(searchString => {
      result = result.concat(searchWords(searchString))
    })
    formik.setFieldValue("words", result);
    formik.setFieldValue("wordSpecifier", "");
  }
  const handleWordSpecifierInputSubmission = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleWordSpecifier();
  }
  const onRemoveWord = (index: number) => {
    const newWords = [...formik.values.words];
    newWords.splice(index, 1);
    formik.setFieldValue("words", newWords);
  }
  return <Box>
    <h2>
      Test
    </h2>
    <form onSubmit={formik.handleSubmit}>
      <TextField
        fullWidth={true} id={"name"} name={"name"} label={"Name"} value={formik.values.name}
        onChange={formik.handleChange}
      />
      <TextField
        fullWidth={true} id={"description"} name={"description"} label={"Description"} value={formik.values.description}
        onChange={formik.handleChange}
      />
      <Box style={{display: "flex"}} mt={2}>
        <TextField
          fullWidth={true} id={"wordSpecifier"} name={"wordSpecifier"} label={"Search words"}
          value={formik.values.wordSpecifier} onChange={formik.handleChange} onSubmit={handleWordSpecifierInputSubmission}
        />
        <Button variant={"contained"} size={"small"} onClick={handleWordSpecifier}>Add</Button>
      </Box>
      <Box mt={2}>
        {formik.values.words.map((word, index) => {
          return <WordCard word={word} onRemove={onRemoveWord} index={index} key={`${index}-${word.meaning}`}/>
        })}
      </Box>
      <p>
        <Typography variant={"h6"}>WordsCount: {formik.values.words.length}</Typography>
      </p>
      <Button type={"submit"} >
        Generate
      </Button>
      <a ref={downloadLinkRef}>Download</a>
    </form>
  </Box>
};
