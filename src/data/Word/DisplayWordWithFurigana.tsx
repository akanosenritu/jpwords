import React from "react";
import * as wanakana from "wanakana";
import {fit} from "furigana";
import {WordType} from "./Word";

const assignRuby = (base: string, ruby: string) => {
  if (!base) return ""
  const tokens = fit(base, ruby, {type: "object"});
  if (tokens) {
    return <span key={base}>{tokens.map(token => {
      const {w, r} = token;
      if (w === r) return <span key={w}>{w}</span>;
      else {
        return <ruby key={w}>
          {w}
          <rt>{r}</rt>
        </ruby>
      }
    })}</span>
  }
  return <span key={base}>{base}</span>
}

type DisplayWordWithFuriganaProps = {
  word: WordType
}

export const DisplayWordWithFurigana: React.FC<DisplayWordWithFuriganaProps> = props => {
  if (!props.word.kanji) return <span>{props.word.kana}</span>
  if (props.word.kanji.includes("～")) {
    const kanjiSplit = props.word.kanji.split("～")
    const kanaSplit = props.word.kana.split("～")
    if (kanjiSplit.length === kanaSplit.length) {
      const res: (string|React.ReactElement)[] = [assignRuby(kanjiSplit[0], kanaSplit[0])]
      for (let i=1; i<kanjiSplit.length; i++) {
        res.push("～")
        res.push(assignRuby(kanjiSplit[i], kanaSplit[i]))
      }
      return <span>{res}</span>
    }
  }
  return <span>{assignRuby(props.word.kanji, props.word.kana)}</span>
};
