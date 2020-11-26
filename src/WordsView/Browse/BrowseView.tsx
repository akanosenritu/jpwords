import React from "react";
import {Box} from "@material-ui/core";
import {availableWords} from "../../data/Word";
import {loadPracticeHistory} from "../../data/Storage/PracticeHistory";
import {FixedSizeList} from "react-window";


type RowType = {
  id: string,
  kana: string,
  kanji: string,
  meaning: string,
  nPractices: string,
  strength: string,
  nextPracticeDate: string
}
const practiceHistory = loadPracticeHistory();
const headerRow = {
  id: "ID",
  kana: "Kana",
  kanji: "Kanji",
  meaning: "Meaning",
  nPractices: "N. Pra.",
  strength: "Strength",
  nextPracticeDate: "Next Pra."
} as RowType

const dataRows = Object.values(availableWords).map(word => {
  const wordHistory = practiceHistory.wordsHistory[word.uuid]
  return {
    id: word.uuid,
    kana: word.kana,
    kanji: word.kanji,
    meaning: word.meaning,
    nPractices: (wordHistory? wordHistory.nPractices: 0).toString(),
    strength: (wordHistory? wordHistory.strength: 0).toString(),
    nextPracticeDate: wordHistory? wordHistory.nextPracticeDate: "",
  } as RowType
})

const rows = [headerRow].concat(dataRows);

type ItemRendererProps = {
  data: any,
  index: number,
  style: any
}

const ItemRenderer: React.FC<ItemRendererProps> = props => {
  const row = props.data[props.index]
  return <div key={row.id} style={props.style}>
    <div style={{borderBottom: "1px solid #f2f2f2", height: "100%", backgroundColor: props.index===0? "lightgray": ""}}>
      <div style={{display: "inline-block", width: 400}}>{row.id}</div>
      <div style={{display: "inline-block", width: 200}}>{row.kanji}</div>
      <div style={{display: "inline-block", width: 200}}>{row.kana}</div>
      <div style={{display: "inline-block", width: 500}}>{row.meaning}</div>
      <div style={{display: "inline-block", width: 100}}>{row.nPractices}</div>
      <div style={{display: "inline-block", width: 100}}>{row.strength}</div>
      <div style={{display: "inline-block", width: 400}}>{row.nextPracticeDate}</div>
    </div>
  </div>
}
export const WordBrowserView: React.FC = () => {
  return <Box height={1000} width={2000} style={{margin: "auto"}}>
    <FixedSizeList height={1000} width={2000} itemCount={rows.length} itemSize={30} itemData={rows}>
      {ItemRenderer}
    </FixedSizeList>
  </Box>;
}
