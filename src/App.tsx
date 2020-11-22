import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import {WordsView} from "./WordsView/WordsView";
import {ConfigurationsEntry} from "./General/ConfigurationsScreen";

function App() {
  return (
    <div style={{minWidth: 320, maxWidth: 500, margin: "auto", position:"relative"}}>
      <ConfigurationsEntry />
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
  );
}

export default App;
