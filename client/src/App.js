import React, { Component } from "react";
import { Auth } from 'aws-amplify';
import "./App.css";
import Feed from "./Feed";
import Header from './components/Header';
import Routes from './Routes';

class App extends Component {
  constructor(props){
    super(props);
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
    } catch(e) {
      // If there's no current user, don't bother notifying
      if (e !== 'No current user'){
        alert(e);
      }
    }
  }

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