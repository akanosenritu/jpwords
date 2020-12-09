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
import {Navigation} from "./General/Navigation";
import {UserProvider} from "./data/User";
import {Settings} from "./SettingsView/Settings";

function App() {
  return (
    <div>
      <Router>
        <UserProvider>
          <Navigation />
          <div style={{minWidth: 320, maxWidth: 700, margin: "auto", position:"relative"}}>
            <Switch>
              <Route path={"/words"}>
                <WordsView />
              </Route>
              <Route path={"/grammar"}>
                <GrammarView />
              </Route>
              <Route path={"/settings"}>
                <Settings />
              </Route>
              <Route path={"/manageWords"}>
                <ManageWordsView />
              </Route>
              <Route path={"/manageWordNotes"}>
                <ManageWordNotesView />
              </Route>
              <Route exact path={"/"}>
                <Redirect to={"words/practiceWordList"} />
              </Route>
            </Switch>
          </div>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
