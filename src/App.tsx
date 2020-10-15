import React from 'react';
import logo from './logo.svg';
import './App.css';
import {PracticeViewBase} from "./PracticeView/PracticeViewBase";
import {Box} from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {PracticeViewAll} from "./PracticeView/PracticeViewAll";
import {PracticeViewEntrance} from "./PracticeView/PracticeViewEntrance";
import {PracticeView} from "./PracticeView/PracticeView";

function App() {
  return (
    <Router>
      <Switch>
        <Route path={"/practice"}>
          <PracticeView />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
