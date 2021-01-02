import React from "react";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import {ManageWordsView} from "./ManageWordsView/ManageWordsView";
import {ManageWordNotesView} from "./ManageWordNotesView/ManageWordNotesView";

export const ManageView: React.FC = () => {
  const match = useRouteMatch();
  return <div>
    <Switch>
      <Route path={`${match.path}/words`}>
        <ManageWordsView />
      </Route>
      <Route path={`${match.path}/wordNotes`}>
        <ManageWordNotesView />
      </Route>
    </Switch>
  </div>
};