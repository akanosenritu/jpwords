import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import {WordsView} from "./WordsView/WordsView";
import {UserPreferenceContext} from "./WordsView/Contexts";
import {loadUserPreference} from "./data/Storage/UserPreference";

function App() {
  const userPreference = loadUserPreference();
  return (
    <UserPreferenceContext.Provider value={userPreference}>
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
    </UserPreferenceContext.Provider>
  );
}

export default App;
