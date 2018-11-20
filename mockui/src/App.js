import React, { Component } from "react";
import "./App.css";
import Sidepanel from "./Sidepanel";
import Feed from "./Feed";
import "../node_modules/font-awesome/css/font-awesome.min.css";

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="App listed">
        <Sidepanel />
        <div id="page-wrap">
          <h1 className="fonted">CleverNews</h1>
          <h2>We make news more... clever</h2>
          <br />
          <Feed />
        </div>
      </div>
    );
  }
}

export default App;
