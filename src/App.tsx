import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import {WordsView} from "./WordsView/WordsView";
import {GrammarView} from "./GrammarView/GrammarView";
import {Navigation} from "./General/Navigation";
import {UserProvider} from "./data/User";
import {Settings} from "./SettingsView/Settings";
import {Test} from "./Test/Test";
import {PracticeHistoryProvider} from "./data/PracticeHistory/PracticeHistoryProvider";
import {ManageView} from "./Manage/Manage";

function App() {
  return (
    <div>
      <Router>
        <UserProvider>
          <PracticeHistoryProvider>
            <Navigation />
            <div>
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
                <Route path={"/test"}>
                  <Test />
                </Route>
                <Route path={"/manage"}>
                  <ManageView />
                </Route>
                <Route exact path={"/"}>
                  <Redirect to={"words/practiceWordList"} />
                </Route>
              </Switch>
            </div>
          </PracticeHistoryProvider>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
