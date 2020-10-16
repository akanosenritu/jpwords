import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import {PracticeViewAll} from "./PracticeViewAll";
import {PracticeViewEntrance} from "./PracticeViewEntrance";
import {PracticeViewByIndex} from "./PracticeViewByIndex";
import {PracticeViewResult} from "./PracticeViewResult";
import {PracticeTypeSelectionView} from "./PracticeTypeSelectionView";

export const PracticeView: React.FC = () => {
  const match = useRouteMatch();
  return <Switch>
    <Route path={`${match.path}/all`}>
      <PracticeViewAll />
    </Route>
    <Route path={`${match.path}/byIndex/select`}>
      <PracticeViewByIndex />
    </Route>
    <Route path={`${match.path}/byIndex`}>
      <PracticeTypeSelectionView />
    </Route>
    <Route path={`${match.path}/result`}>
      <PracticeViewResult />
    </Route>
    <Route path={match.path}>
      <PracticeViewEntrance />
    </Route>
  </Switch>
}