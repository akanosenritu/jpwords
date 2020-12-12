import React from "react";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import {ManageWordsView} from "./ManageWordsView/ManageWordsView";

export const ManageView: React.FC = () => {
  const match = useRouteMatch();
  return <div>
    <Switch>
      <Route path={`${match.path}/words`}>
        <ManageWordsView />
      </Route>
    </Switch>
  </div>
};