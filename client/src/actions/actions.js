export const REQUEST_FEED = "REQUEST_FEED";
export const RECEIVE_INIT_FEED = "RECEIVE_INIT_FEED";
export const RECEIVE_SEARCH_FEED = "RECEIVE_SEARCH_FEED";
export const RECEIVE_TOPIC_FEED = "RECEIVE_TOPIC_FEED";
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
export const RECIEVE_BOOKMARKS = "RECIEVE_BOOKMARKS";
export const REQUEST_BOOKMARKS = "REQUEST_BOOKMARKS";
export const ADD_BOOKMARKS = "ADD_BOOKMARKS";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  Accept: "application/json"
};

export const addBookmarks = json => ({
  type: ADD_BOOKMARKS
});
export const requestBookmarks = () => ({
  type: REQUEST_BOOKMARKS
});
export const receiveBookmarks = json => ({
  type: RECIEVE_BOOKMARKS,
  json: json
});
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
      .catch(err => {
        return Promise.reject();
      })
      .then(json => {
        dispatch(receiveInitFeed(json.found));
      })
      .catch(err => {
        return Promise.reject();
      });
  };
}

export function fetchSearchFeed(value) {
  return function(dispatch) {
    dispatch(requestFeed());
    return fetch("http://localhost:5000/api/search?field=" + value, headers)
      .then(results => results.json())
      .catch(err => {
        return Promise.reject();
      })
      .then(json => {
        dispatch(receiveSearchFeed(json.found));
      })
      .catch(err => {
        return Promise.reject();
      });
  };
}

export function fetchTopicFeed(category) {
  return function(dispatch) {
    dispatch(requestFeed());
    return fetch(
      "http://localhost:5000/api/category?field=" + category,
      headers
    )
      .then(results => results.json())
      .catch(err => {
        return Promise.reject();
      })
      .then(json => {
        dispatch(receiveTopicFeed(json.found));
      })
      .catch(err => {
        return Promise.reject();
      });
  };
}

export function fetchBookmarks(access, id, refresh) {
  return function(dispatch) {
    dispatch(requestBookmarks());

    var cust_headers = headers;
    cust_headers["access_token"] = access;
    cust_headers["id_token"] = id;
    cust_headers["refresh_token"] = refresh;

    return fetch("http://localhost:5000/user/bookmarks", {
      method: "GET",
      headers: cust_headers
    })
      .then(results => results.json())
      .catch(err => {
        return Promise.reject();
      })
      .then(json => {
        dispatch(receiveBookmarks(json.found));
      })
      .catch(err => {
        return Promise.reject();
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
      .catch(err => {
        return Promise.reject();
      })
      .then(json => {
        dispatch(receiveLogin(json));
      })
      .catch(err => {
        return Promise.reject();
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
      .catch(err => {
        return Promise.reject();
      })
      .then(json => {
        dispatch(receiveSignUp(json.status));
      })
      .catch(err => {
        return Promise.reject();
      });
  };
}

export function fetchAddBookmarks(access, id, refresh, article) {
  return function(dispatch) {
    var cust_headers = headers;
    cust_headers["access_token"] = access;
    cust_headers["id_token"] = id;
    cust_headers["refresh_token"] = refresh;
    return fetch("http://localhost:5000/user/updateBookmark", {
      method: "PUT",
      headers: cust_headers,
      body: JSON.stringify({ article_id: article })
    })
      .then(results => results.json())
      .catch(err => {
        return Promise.reject();
      })
      .then(json => {
        dispatch(addBookmarks(json.status));
      })
      .catch(err => {
        return Promise.reject();
      });
  };
}
