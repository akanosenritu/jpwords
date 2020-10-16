import React from 'react';
import logo from './logo.svg';
import './App.css';
import {PracticeViewBase} from "./PracticeView/PracticeViewBase";
import {Box} from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {PracticeView} from "./PracticeView/PracticeView";

function App() {
  return (
    <div style={{width: 400, margin: "auto"}}>
      <Router>
        <Switch>
          <Route path={"/practice"}>
            <PracticeView />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
