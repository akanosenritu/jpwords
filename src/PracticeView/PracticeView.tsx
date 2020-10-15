import React from "react";
import {Box, Button} from "@material-ui/core";
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

export const PracticeView: React.FC = () => {
  const match = useRouteMatch();
  return <Switch>
    <Route path={`${match.path}/all`}>
      <PracticeViewAll />
    </Route>
    <Route path={`${match.path}/index/:start/:end`}>
      <PracticeViewByIndex />
    </Route>
    <Route path={match.path}>
      <PracticeViewEntrance />
    </Route>
  </Switch>
}