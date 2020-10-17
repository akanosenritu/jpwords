import React, {useState} from "react";
import {
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";
import {PracticeViewEntrance} from "./PracticeViewEntrance";
import {PracticeViewByIndex, PracticeViewByIndexWithReversedSelection} from "./PracticeViewByIndex";
import {PracticeViewResult} from "./PracticeViewResult";
import {PracticeTypeSelectionView} from "./PracticeTypeSelectionView";

export const PracticeView: React.FC = () => {
  const match = useRouteMatch();
  return <Switch>
    <Route path={`${match.path}/byIndex/select`}>
      <PracticeViewByIndex />
    </Route>
    <Route path={`${match.path}/byIndex/reverseSelect`}>
      <PracticeViewByIndexWithReversedSelection />
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