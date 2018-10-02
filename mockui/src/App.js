import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Feed from "./Feed"
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ids = []
    }
  }
  // field will be a search term
  add(field){
    let ids = this.state.ids.slice() // deepcopy

    fetch("http://127.0.0.1:5000/sysinfo?field="+field, {
      method: "GET",
      dataType: "JSON",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      }
    }).then((resp) => {
      return resp.json()
    }).then((data) =>{
      this.setState({
        ids = data
      })
    }).catch((error) => {
      console.log("errored")
    })
  }
  render() {
    return (
      <div className="App">
        <Feed />
      </div>
    );
  }
}

export default App;
