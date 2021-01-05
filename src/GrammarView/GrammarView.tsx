import React, {lazy, Suspense} from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  useLocation
} from "react-router-dom";
import {DebugContext} from "../General/Contexts";
import {GrammarViewEntrance} from "./GrammarViewEntrance";

const Particles = lazy(() => import("./Particles/Particles"))
const SentencePatterns = lazy(() => import("./SentencePatterns/SentencePatterns"))

export const GrammarView: React.FC = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search.substring(1));
  const debug = params.get("debug");
  return <DebugContext.Provider value={!!debug}>
    <Suspense fallback={<div>Loading...</div>}>
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
    </Suspense>
  </DebugContext.Provider>
};