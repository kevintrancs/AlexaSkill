import React, { Component } from "react";
import "./App.css";
import Header from "./containers/Header";
import Routes from "./Routes";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Routes />
      </div>
    );
  }
}

export default App;
