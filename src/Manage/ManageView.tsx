import React, {Suspense, lazy} from "react";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import {StaffOnly} from "../General/StaffOnly";

export const ManageView: React.FC = () => {
  const match = useRouteMatch();
  const ManageWordsView = lazy(()=>import("./ManageWordsView/ManageWordsView"))
  const ManageWordNotesView = lazy(()=>import("./ManageWordNotesView/ManageWordNotesView"))
  return <div>
    <StaffOnly>
      <Switch>
        <Suspense fallback={<div>Loading...</div>}>
          <Route path={`${match.path}/words`}>
            <ManageWordsView />
          </Route>
          <Route path={`${match.path}/wordNotes`}>
            <ManageWordNotesView />
          </Route>
        </Suspense>
      </Switch>
    </StaffOnly>
  </div>
};