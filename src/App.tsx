import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import {WordsView} from "./WordsView/WordsView";
import {ManageWordsView} from "./ManageWordsView/ManageWordsView";

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route path={"/words"}>
            <WordsView />
          </Route>
          <Route path={"/manage"}>
            <ManageWordsView />
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
