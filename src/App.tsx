import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation
} from "react-router-dom";
import {WordsView} from "./WordsView/WordsView";

const DebugContext = React.createContext(false);

function App() {
  return (
    <DebugContext.Provider value={false}>
      <div style={{minWidth: 320, maxWidth: 500, margin: "auto"}}>
        <Router>
          <Switch>
            <Route path={"/words"}>
              <WordsView />
            </Route>
            <Route exact path={"/"}>
              <Redirect to={"words/practiceWordList"} />
            </Route>
          </Switch>
        </Router>
      </div>
    </DebugContext.Provider>
  );
}

export default App;
