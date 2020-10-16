import React from "react";
import {
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";

export const BrowseView: React.FC = props => {
  const match = useRouteMatch();
  return <Switch>
    <Route path={`${match.path}/byIndex/select`}>
    </Route>
  </Switch>
}
