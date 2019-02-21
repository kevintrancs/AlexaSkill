export const REQUEST_FEED = "REQUEST_FEED";
export const RECEIVE_INIT_FEED = "RECEIVE_INIT_FEED";
export const RECEIVE_SEARCH_FEED = "RECEIVE_SEARCH_FEED";
export const RECEIVE_TOPIC_FEED = "RECEIVE_TOPIC_FEED";
export const CLOSE_SIDE = "CLOSE_SIDE";
export const OPEN_SIDE = "OPEN_SIDE";
export const OPEN_NEST = "OPEN_NEST";
export const CLOSE_NEST = "CLOSE_NEST";
export const SETTINGS_CHOSEN = "SETTINGS_CHOSEN"

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true
};

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
export const settingsChosen = () => ({
  type: SETTINGS_CHOSEN
});

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
  return function(dispatch){
    dispatch(closeNest());
  };
}

export function chooseSettings() {
  return function(dispatch) {
    dispatch(settingsChosen());
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

export function fetchSerachFeed(value) {
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
      "http://localhost:5000/api/category?field=" + category,
      headers
    )
      .then(results => results.json())
      .then(json => {
        dispatch(receiveTopicFeed(json.found));
      });
  };
}


