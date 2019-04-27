export const REQUEST_FEED = "REQUEST_FEED";
export const RECEIVE_INIT_FEED = "RECEIVE_INIT_FEED";
export const RECEIVE_SEARCH_FEED = "RECEIVE_SEARCH_FEED";
export const RECEIVE_TOPIC_FEED = "RECEIVE_TOPIC_FEED";
export const RECEIVE_ML_FEED = "RECEIVE_ML_FEED";
export const RECEIVE_BOOKMARKS_FEED = "RECEIVE_BOOKMARK_FEED";
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
export const REQUEST_HISTORY = "REQUEST_HISTORY";
export const RECEIVE_HISTORY = "RECEIVE_HISTORY";
export const REQUEST_LIKES = "REQUEST_LIKES";
export const RECEIVE_LIKES = "RECEIVE_LIKES";
export const REQUEST_DISLIKES = "REQUEST_DISLIKES";
export const RECEIVE_DISLIKES = "RECEIVE_DISLIKES";
export const ADD_BOOKMARKS = "ADD_BOOKMARKS";
export const STORE_EVENT = "STORE_EVENT";
export const ADD_HISTORY = "ADD_HISTORY";
export const ADD_LIKES = "ADD_LIKES";
export const ADD_DISLIKES = "ADD_DISLIKES";
export const REMOVE_BOOKMARKS = "REMOVE_BOOKMARKS";
export const REMOVE_LIKES = "REMOVE_LIKES";
export const REMOVE_DISLIKES = "REMOVE_DISLIKES";
export const READ_ARTICLE = "READ_ARTICLE";
export const COLLAB_FILTER = "COLLAB_FILTER";
export const VERTICLE_FEED = "VERTICLE_FEED";
export const HORIZONTAL_FEED = "HORIZONTAL_FEED";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  Accept: "application/json"
};

export const verticleFeed = () => ({
  type: VERTICLE_FEED
});
export const horizontalFeed = () => ({
  type: HORIZONTAL_FEED
});
export const collabFilter = json => ({
  type: COLLAB_FILTER,
  json: json
});
export const readArticle = json => ({
  type: READ_ARTICLE,
  json: json
});
export const storeEvent = json => ({
  type: STORE_EVENT
});
export const addHistory = json => ({
  type: ADD_HISTORY
});
export const addBookmarks = json => ({
  type: ADD_BOOKMARKS
});
export const removeBookmark = json => ({
  type: REMOVE_BOOKMARKS
});
export const addLikes = json => ({
  type: ADD_LIKES
});
export const removeLike = json => ({
  type: REMOVE_LIKES
});
export const addDislikes = json => ({
  type: ADD_DISLIKES
});
export const removeDislike = json => ({
  type: REMOVE_DISLIKES
});
export const requestBookmarks = () => ({
  type: REQUEST_BOOKMARKS
});
export const receiveBookmarks = json => ({
  type: RECIEVE_BOOKMARKS,
  json: json
});
export const requestHistory = () => ({
  type: REQUEST_HISTORY
});
export const receiveHistory = json => ({
  type: RECEIVE_HISTORY,
  json: json
});
export const requestLikes = () => ({
  type: REQUEST_LIKES
});
export const receiveLikes = json => ({
  type: RECEIVE_LIKES,
  json: json
});
export const requestDislikes = () => ({
  type: REQUEST_DISLIKES
});
export const receiveDislikes = json => ({
  type: RECEIVE_DISLIKES,
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
export const receiveMlFeed = json => ({
  type: RECEIVE_ML_FEED,
  json: json
});
export const receiveBookmarksFeed = json => ({
  type: RECEIVE_BOOKMARKS_FEED,
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

export function renderVertical() {
  return function(dispatch) {
    dispatch(verticleFeed());
  };
}

export function renderHorizontal() {
  return function(dispatch ){
    dispatch(horizontalFeed());
  };
}

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

export function fetchMLTwoFeed(access, id, refresh){
  return function(dispatch){
    dispatch(requestFeed());
      var cust_headers = headers;
      cust_headers["access_token"] = access;
      cust_headers["id_token"] = id;
      cust_headers["refresh_token"] = refresh;

      return fetch("http://localhost:5000/user/mltwo", {
        method: "GET",
        headers: cust_headers
      })      
      .then(results => results.json())
      .then(json => {
        dispatch(receiveMlFeed(json.found));
      });
  }
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

export function fetchBookmarksFeed(access, id, refresh) {
  return function(dispatch) {
    dispatch(requestFeed());
    // Refresh our bookmarks just in case
    // Then set items = bookmarks
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
        dispatch(receiveBookmarksFeed(json.found));
      })
      .catch(err => {
        return Promise.reject();
      });
  };
}

export function fetchRelatedArticles(id) {
  return function(dispatch) {
    dispatch(requestFeed());
    return fetch("http://localhost:5000/api/ml?field=" + id, headers)
      .then(results => results.json()).catch(err => {
        return Promise.reject();
      })
      .then(json => {
        dispatch(receiveMlFeed(json.found));
      }).catch(err => {
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

export function fetchLikes(access, id, refresh) {
  return function(dispatch) {
    var cust_headers = headers;
    cust_headers["access_token"] = access;
    cust_headers["id_token"] = id;
    cust_headers["refresh_token"] = refresh;
    return fetch("http://localhost:5000/user/likes", {
      method: "GET",
      headers: cust_headers
    })
      .then(results => results.json())
      .catch(err => {
        return Promise.reject();
      })
      .then(json => {
        dispatch(receiveLikes(json.found));
      })
      .catch(err => {
        return Promise.reject();
      });
  };
}

export function fetchDislikes(access, id, refresh) {
  return function(dispatch) {
    var cust_headers = headers;
    cust_headers["access_token"] = access;
    cust_headers["id_token"] = id;
    cust_headers["refresh_token"] = refresh;
    return fetch("http://localhost:5000/user/dislikes", {
      method: "GET",
      headers: cust_headers
    })
      .then(results => results.json())
      .catch(err => {
        return Promise.reject();
      })
      .then(json => {
        dispatch(receiveDislikes(json.found));
      })
      .catch(err => {
        return Promise.reject();
      });
  };
}

export function fetchHistory(access, id, refresh) {
  return function(dispatch) {
    dispatch(requestHistory());
    var cust_headers = headers;
    cust_headers["access_token"] = access;
    cust_headers["id_token"] = id;
    cust_headers["refresh_token"] = refresh;

    return fetch("http://localhost:5000/user/history", {
      method: "GET",
      headers: cust_headers
    })
      .then(results => results.json())
      .catch(err => {
        return Promise.reject();
      })
      .then(json => {
        dispatch(receiveHistory(json.found));
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

export function fetchReadArticle(access, id, refresh, article_id) {
  return function(dispatch) {
    var cust_headers = headers;
    cust_headers["access_token"] = access;
    cust_headers["id_token"] = id;
    cust_headers["refresh_token"] = refresh;
    return fetch("http://localhost:5000/user/readArticle", {
      method: "PUT",
      headers: cust_headers,
      body: JSON.stringify({ article_id: article_id})
    })
      .then(results => results.json())
      .catch(err => {
        return Promise.reject();
      })
      .then(json => {
        dispatch(readArticle(json.status));
      })
      .catch(err => {
        return Promise.reject();
      });
  };
}

export function fetchCollabFilter(access, id, refresh, article_id) {
  return function(dispatch) {
    dispatch(requestFeed());
    var cust_headers = headers;
    cust_headers["access_token"] = access;
    cust_headers["id_token"] = id;
    cust_headers["refresh_token"] = refresh;
    return fetch("http://localhost:5000/user/collabFilter", {
      method: "PUT",
      headers: cust_headers,
      body: JSON.stringify({ article_id: article_id})
    })
      .then(results => results.json())
      .catch(err => {
        return Promise.reject();
      })
      .then(json => {
        dispatch(collabFilter(json.found));
      })
      .catch(err => {
        return Promise.reject();
      });
  };
}

export function fetchStoreEvents(access, id, refresh, dict) {
  return function(dispatch) {
    var cust_headers = headers;
    cust_headers["access_token"] = access;
    cust_headers["id_token"] = id;
    cust_headers["refresh_token"] = refresh;
    return fetch("http://localhost:5000/user/addEvent", {
      method: "PUT",
      headers: cust_headers,
      body: JSON.stringify({ event_dict: dict })
    })
      .then(results => results.json())
      .catch(err => {
        return Promise.reject();
      })
      .then(json => {
        dispatch(storeEvent(json.status));
      })
      .catch(err => {
        return Promise.reject();
      });
  };
}

// functions for adding an article (presumably article id) to a given
// user list, defined within the function title / api address

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

export function fetchRemoveBookmark(access, id, refresh, article) {
  return function(dispatch) {
    dispatch(removeBookmark());
    var cust_headers = headers;
    cust_headers["access_token"] = access;
    cust_headers["id_token"] = id;
    cust_headers["refresh_token"] = refresh;
    return fetch("http://localhost:5000/user/removeBookmark", {
      method: "PUT",
      headers: cust_headers,
      body: JSON.stringify({ article_id: article })
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

export function fetchAddHistory(access, id, refresh, article) {
  return function(dispatch) {
    var cust_headers = headers;
    cust_headers["access_token"] = access;
    cust_headers["id_token"] = id;
    cust_headers["refresh_token"] = refresh;
    return fetch("http://localhost:5000/user/updateHistory", {
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
export function fetchAddLikes(access, id, refresh, article) {
  return function(dispatch) {
    var cust_headers = headers;
    cust_headers["access_token"] = access;
    cust_headers["id_token"] = id;
    cust_headers["refresh_token"] = refresh;
    return fetch("http://localhost:5000/user/updateLikes", {
      method: "PUT",
      headers: cust_headers,
      body: JSON.stringify({ article_id: article })
    })
      .then(results => results.json())
      .catch(err => {
        return Promise.reject();
      })
      .then(json => {
        dispatch(addLikes(json.status));
      })
      .catch(err => {
        return Promise.reject();
      });
  };
}

export function fetchRemoveLike(access, id, refresh, article) {
  return function(dispatch) {
    dispatch(removeBookmark());
    var cust_headers = headers;
    cust_headers["access_token"] = access;
    cust_headers["id_token"] = id;
    cust_headers["refresh_token"] = refresh;
    return fetch("http://localhost:5000/user/removeLike", {
      method: "PUT",
      headers: cust_headers,
      body: JSON.stringify({ article_id: article })
    })
      .then(results => results.json())
      .catch(err => {
        return Promise.reject();
      })
      .then(json => {
        dispatch(receiveLikes(json.found));
      })
      .catch(err => {
        return Promise.reject();
      });
  };
}
export function fetchAddDislikes(access, id, refresh, article) {
  return function(dispatch) {
    var cust_headers = headers;
    cust_headers["access_token"] = access;
    cust_headers["id_token"] = id;
    cust_headers["refresh_token"] = refresh;
    return fetch("http://localhost:5000/user/updateDislikes", {
      method: "PUT",
      headers: cust_headers,
      body: JSON.stringify({ article_id: article })
    })
      .then(results => results.json())
      .catch(err => {
        return Promise.reject();
      })
      .then(json => {
        dispatch(addDislikes(json.status));
      })
      .catch(err => {
        return Promise.reject();
      });
  };
}

export function fetchRemoveDislike(access, id, refresh, article) {
  return function(dispatch) {
    dispatch(removeBookmark());
    var cust_headers = headers;
    cust_headers["access_token"] = access;
    cust_headers["id_token"] = id;
    cust_headers["refresh_token"] = refresh;
    return fetch("http://localhost:5000/user/removeDislike", {
      method: "PUT",
      headers: cust_headers,
      body: JSON.stringify({ article_id: article })
    })
      .then(results => results.json())
      .catch(err => {
        return Promise.reject();
      })
      .then(json => {
        dispatch(receiveDislikes(json.found));
      })
      .catch(err => {
        return Promise.reject();
      });
  };
}
