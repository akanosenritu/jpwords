import React from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  useLocation
} from "react-router-dom";
import {PracticeWordListView} from "./PracticeWordList/PracticeWordListView";
import {DebugContext} from "./Contexts";

export const WordsView: React.FC = props => {
  const match = useRouteMatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search.substring(1));
  const debug = params.get("debug");
  return <DebugContext.Provider value={!!debug}>
    <Switch>
      <Route path={`${match.path}/practiceWordList`}>
        <PracticeWordListView />
      </Route>
    </Switch>
  </DebugContext.Provider>
};