import React, { Component } from "react";
import "./App.css";
import Feed from "./Feed";
import Header from './components/Header';
import Routes from './Routes';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Routes/>
      </div>
    );
  }
}

export default App;