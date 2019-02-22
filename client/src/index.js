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
import { BrowserRouter as Router } from "react-router-dom";

const store = createStore(reducer, applyMiddleware(thunk, logger));

store.subscribe(() => {
  localStorage.setItem("access", store.getState().access);
  localStorage.setItem("id", store.getState().id);
  localStorage.setItem("refresh", store.getState().refresh);
  localStorage.setItem("email", store.getState().email);
});
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);
