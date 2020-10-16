import React from "react";
import {
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";
import {PracticeView} from "./Practice/PracticeView";

export const WordsView: React.FC = props => {
  const match = useRouteMatch();
  return <Switch>
    <Route path={`${match.path}/practice`}>
      <PracticeView />
    </Route>
  </Switch>
}