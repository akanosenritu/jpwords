import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {PracticeView} from "./PracticeView/PracticeView";

function App() {
  return (
    <div style={{minWidth: 320, maxWidth: 500, margin: "auto"}}>
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
