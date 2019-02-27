export const REQUEST_FEED = "REQUEST_FEED";
export const RECEIVE_INIT_FEED = "RECEIVE_INIT_FEED";
export const RECEIVE_SEARCH_FEED = "RECEIVE_SEARCH_FEED";
export const RECEIVE_TOPIC_FEED = "RECEIVE_TOPIC_FEED";
export const RECEIVE_ML_FEED = "RECEIVE_ML_FEED";
export const CLOSE_SIDE = "CLOSE_SIDE";
export const OPEN_SIDE = "OPEN_SIDE";
export const OPEN_NEST = "OPEN_NEST";
export const CLOSE_NEST = "CLOSE_NEST";
export const REQUEST_LOG_IN = "REQUEST_LOG_IN";
export const RECEIVE_LOG_IN = "RECEIVE_LOG_IN";
export const REQUEST_LOG_OUT = "REQUEST_LOG_OUT";
export const RECEIVE_LOG_OUT = "RECEIVE_LOG_OUT";
export const UPDATE_EMAIL = "UPDATE_EMAIL";
export const UPDATE_PASSWORD = "UPDATE_PASSWORD";
export const UPDATE_PASSWORD_CONFIRM = "UPDATE_PASSWORD_CONFIRM";
export const REQUEST_SIGNUP = "REQUEST_SIGNUP";
export const RECEIVE_SIGNUP = "RECEIVE_SIGNUP";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  Accept: "application/json"
};

export const requestSignUp = () => ({
  type: REQUEST_SIGNUP
});
export const receiveSignUp = status => ({
  type: RECEIVE_SIGNUP,
  json: status
});

export const closeSide = () => ({
  type: CLOSE_SIDE
});
export const openSide = () => ({
  type: OPEN_SIDE
});
export const requestFeed = () => ({
  type: REQUEST_FEED
});
export const receiveInitFeed = json => ({
  type: RECEIVE_INIT_FEED,
  json: json
});
export const receiveSearchFeed = json => ({
  type: RECEIVE_SEARCH_FEED,
  json: json
});
export const receiveTopicFeed = json => ({
  type: RECEIVE_TOPIC_FEED,
  json: json
});
export const receiveMlFeed = json => ({
  type: RECEIVE_ML_FEED,
  json: json
});
export const openNest = () => ({
  type: OPEN_NEST
});
export const closeNest = () => ({
  type: CLOSE_NEST
});
export const requestLogin = () => ({
  type: REQUEST_LOG_IN
});
export const receiveLogin = json => ({
  type: RECEIVE_LOG_IN,
  json: json
});
export const requestLogout = () => ({
  type: REQUEST_LOG_OUT
});
export const receiveLogout = () => ({
  type: RECEIVE_LOG_OUT
});
export const updateEmail = str => ({
  type: UPDATE_EMAIL,
  str: str
});
export const updatePassword = str => ({
  type: UPDATE_PASSWORD,
  str: str
});
export const updatePasswordConfirm = str => ({
  type: UPDATE_PASSWORD_CONFIRM,
  str: str
});
// Dispatches
export function updateEmailWorker(val) {
  return function(dispatch) {
    dispatch(updateEmail(val));
  };
}

export function updatePasswordWorker(val) {
  return function(dispatch) {
    dispatch(updatePassword(val));
  };
}

export function updatePasswordConfirmWorker(val) {
  return function(dispatch) {
    dispatch(updatePasswordConfirm(val));
  };
}

export function loggingOutWorker() {
  return function(dispatch) {
    dispatch(requestLogout());
  };
}

export function loggedOutWorker() {
  return function(dispatch) {
    dispatch(receiveLogout());
  };
}

export function closeDrawer() {
  return function(dispatch) {
    dispatch(closeSide());
  };
}
export function openDrawer() {
  return function(dispatch) {
    dispatch(openSide());
  };
}

export function openList() {
  return function(dispatch) {
    dispatch(openNest());
  };
}

export function closeList() {
  return function(dispatch) {
    dispatch(closeNest());
  };
}

export function fetchInitFeed() {
  return function(dispatch) {
    dispatch(requestFeed());
    return fetch(
      "http://localhost:5000/api/search?field=trendingtopics",
      headers
    )
      .then(results => results.json())
      .then(json => {
        dispatch(receiveInitFeed(json.found));
      });
  };
}

export function fetchSearchFeed(value) {
  return function(dispatch) {
    dispatch(requestFeed());
    return fetch("http://localhost:5000/api/search?field=" + value, headers)
      .then(results => results.json())
      .then(json => {
        dispatch(receiveSearchFeed(json.found));
      });
  };
}

export function fetchTopicFeed(category) {
  return function(dispatch) {
    dispatch(requestFeed());
    return fetch(
      "http://localhost:5000/api/category?field=" + category, headers)
      .then(results => results.json())
      .then(json => {
        dispatch(receiveTopicFeed(json.found));
      });
  };
}

export function fetchRelatedArticles(id) {
  return function(dispatch) {
    dispatch(requestFeed());
    return fetch(
      "http://localhost:5000/api/ml?field=" + id, headers)
      .then(results => results.json())
      .then(json => {
        dispatch(receiveMlFeed(json.found));
      });
  };
}

export function fetchLogin(email, password) {
  return function(dispatch) {
    dispatch(requestLogin());

    return fetch("http://localhost:5000/user/login", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ email: email, password: password })
    })
      .then(results => results.json())
      .then(json => {
        dispatch(receiveLogin(json));
      });
  };
}

export function fetchSignUp(email, password) {
  return function(dispatch) {
    dispatch(requestSignUp());

    return fetch("http://localhost:5000/user/register", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ email: email, password: password })
    })
      .then(results => results.json())
      .then(json => {
        dispatch(receiveSignUp(json.status));
      });
  };
}
