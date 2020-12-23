import React from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  useLocation
} from "react-router-dom";
import {PracticeWordListView} from "./PracticeWordList/PracticeWordListView";
import {DebugContext} from "../General/Contexts";
import {WordProvider} from "../data/Word/WordProvider";
import {WordListsProvider} from "../data/WordLists/WordListsProvider";

export const WordsView: React.FC = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search.substring(1));
  const debug = params.get("debug");
  return <DebugContext.Provider value={!!debug}>
    <WordProvider>
      <WordListsProvider>
        <Switch>
          <Route path={`${match.path}/practiceWordList`}>
            <PracticeWordListView />
          </Route>
        </Switch>
      </WordListsProvider>
    </WordProvider>
    </DebugContext.Provider>
};