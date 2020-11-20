import React from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  useLocation
} from "react-router-dom";
import {PracticeWordListView} from "./PracticeWordList/PracticeWordListView";
import {DebugContext} from "./Contexts";
import {CreateWordList} from "./CreateOrModifyWordList/CreateWordList";

export const WordsView: React.FC = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search.substring(1));
  const debug = params.get("debug");
  return <DebugContext.Provider value={!!debug}>
    <Switch>
      <Route path={`${match.path}/practiceWordList`}>
        <PracticeWordListView />
      </Route>
      <Route path={`${match.path}/create`}>
        <CreateWordList />
      </Route>
    </Switch>
  </DebugContext.Provider>
};