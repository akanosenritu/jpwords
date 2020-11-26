import React from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  useLocation
} from "react-router-dom";
import {PracticeWordListView} from "./PracticeWordList/PracticeWordListView";
import {DebugContext} from "./Contexts";
import {WordBrowserView} from "./Browse/BrowseView";

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
      <Route path={`${match.path}/browse`}>
        <WordBrowserView />
      </Route>
    </Switch>
  </DebugContext.Provider>
};