import React from "react";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import sentencePatternsProblemsData from "../../data/Grammar/SentencePatterns/sentencePatternProblems.json"
import {SentencePatternEntry} from "./SentencePatternEntry";

export const SentencePatterns: React.FC = props => {
  const match = useRouteMatch();
  const sentencePatterns = Object.keys(sentencePatternsProblemsData.sentencePatterns)
  return <Switch>
    {sentencePatterns.map(sentencePattern => {
      return <Route path={`${match.path}/${sentencePattern}`}>
        <SentencePatternEntry sentencePattern={sentencePattern} />
      </Route>
    })}
    </Switch>
}