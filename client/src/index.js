import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Test from "./Test";
import App from "./App";
import reducer from "./reducers/reducer";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { logger } from "redux-logger";

const store = createStore(reducer, applyMiddleware(thunk, logger));
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
