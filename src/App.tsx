import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import {WordsView} from "./WordsView/WordsView";
import {ManageWordsView} from "./Manage/ManageWordsView/ManageWordsView";
import {ManageWordNotesView} from "./Manage/ManageWordNotesView/ManageWordNotesView";
import {GrammarView} from "./GrammarView/GrammarView";
import {Login} from "./Login";

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route path={"/words"}>
            <WordsView />
          </Route>
          <Route path={"/grammar"}>
            <GrammarView />
          </Route>
          <Route path={"/manageWords"}>
            <ManageWordsView />
          </Route>
          <Route path={"/manageWordNotes"}>
            <ManageWordNotesView />
          </Route>
          <Route path={"/login"}>
            <Login />
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
