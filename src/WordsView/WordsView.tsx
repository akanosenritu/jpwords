import React from "react";
import {
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";
import {PracticeView} from "./Practice/PracticeView";
import {PracticeWordListViewOverview} from "./PracticeWordList/PracticeWordListViewOverview";
import {PracticeWordListView} from "./PracticeWordList/PracticeWordListView";

export const WordsView: React.FC = props => {
  const match = useRouteMatch();
  return <Switch>
    <Route path={`${match.path}/practice`}>
      <PracticeView />
    </Route>
    <Route path={`${match.path}/practiceWordList`}>
      <PracticeWordListView />
    </Route>
  </Switch>
};