import {
  REQUEST_FEED,
  RECEIVE_INIT_FEED,
  RECEIVE_SEARCH_FEED,
  RECEIVE_TOPIC_FEED,
  OPEN_SIDE,
  CLOSE_SIDE,
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  REQUEST_LOG_IN,
  RECEIVE_LOG_IN,
  REQUEST_LOG_OUT,
  RECEIVE_LOG_OUT
} from "../actions/actions";

const reducer = (state = { open: true, loading: false, items: [], loggedIn: false, loggingIn: false, email: "", password: "" }, action) => {
  switch (action.type) {
    case REQUEST_FEED:
      return { ...state, loading: true };
    case RECEIVE_INIT_FEED:
      return { ...state, items: action.json, loading: false };
    case RECEIVE_SEARCH_FEED:
      return { ...state, items: action.json, loading: false };
    case RECEIVE_TOPIC_FEED:
      return { ...state, items: action.json, loading: false };
    case OPEN_SIDE:
      return { ...state, open: true };
    case CLOSE_SIDE:
      return { ...state, open: false };
    case UPDATE_EMAIL:
      return { ...state, email: action.str};
    case UPDATE_PASSWORD:
      return { ...state, password: action.str};
    case REQUEST_LOG_IN:
      return { ...state, loggedIn: false, loggingIn: true};
    case RECEIVE_LOG_IN:
      return { ...state, loggedIn: true, loggingIn: true};
    case REQUEST_LOG_OUT:
      return { ...state, loggedIn: true, loggingIn: true}
    case RECEIVE_LOG_OUT:
      return {...state, loggedIn: false, loggingIn: false};
    default:
      return state;
  }
};
export default reducer;
