import React, { Component } from "react";
import "./App.css";
import Sidepanel from "./Sidepanel";
import Feed from "./Feed";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import {
    InputGroup,
    InputGroupAddon,
    Button,
    Input
  } from "reactstrap";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App listed">
        <Sidepanel />
        <div id="page-wrap">
            <div id ="header">
                <h1 className="fonted">CleverNews</h1>
                <h2>We make news more... clever</h2>
                <InputGroup className="col-11 col-sm-5 center">
                <InputGroupAddon addonType="prepend">
                    <Button>
                    <i class="fa fa-search" />
                    </Button>
                </InputGroupAddon>
                <Input placeholder="search" />
                </InputGroup>
            </div>
          <br />
          <Feed />
        </div>
      </div>
    );
  }
}

export default App;
