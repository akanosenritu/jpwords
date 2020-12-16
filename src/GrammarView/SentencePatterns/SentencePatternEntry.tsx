import React　from "react";
import {UserInteractionContext} from "../UserInteractionContext";
import {UserInteractionInput} from "../UserInteractionInput";
import {SentencePattern} from "../../data/Grammar/SentencePatterns/SentencePattern";
import {Box} from "@material-ui/core";

type Props = {
  sentencePattern: string
}

export const SentencePatternEntry: React.FC<Props> = props => {
  return  <div style={{minWidth: 320, maxWidth: 700, margin: "auto", position:"relative"}}>
    <Box mt={2} pl={1}>
      <UserInteractionContext.Provider value={UserInteractionInput}>
        <SentencePattern sentencePattern={props.sentencePattern} />
      </UserInteractionContext.Provider>
    </Box>
  </div>
}
