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
import { BrowserRouter as Router } from 'react-router-dom';
import  Amplify from 'aws-amplify';
import config from './config';

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  }
});

const store = createStore(reducer, applyMiddleware(thunk, logger));
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);
