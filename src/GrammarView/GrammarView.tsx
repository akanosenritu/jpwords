import React from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  useLocation
} from "react-router-dom";
import {DebugContext} from "../General/Contexts";
import {Particles} from "./Particles/Particles";
import {SentencePatterns} from "./SentencePatterns/SentencePatterns";
import {GrammarViewEntrance} from "./GrammarViewEntrance";


export const GrammarView: React.FC = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search.substring(1));
  const debug = params.get("debug");
  return <DebugContext.Provider value={!!debug}>
    <Switch>
      <Route path={`${match.path}/particles`}>
        <Particles />
      </Route>
      <Route path={`${match.path}/sentencePatterns`}>
        <SentencePatterns />
      </Route>
      <Route exact path={`${match.path}`}>
        <GrammarViewEntrance />
      </Route>
    </Switch>
  </DebugContext.Provider>
};