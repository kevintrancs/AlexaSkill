import {
  REQUEST_FEED,
  RECEIVE_INIT_FEED,
  RECEIVE_SEARCH_FEED,
  RECEIVE_TOPIC_FEED,
  RECEIVE_ML_FEED,
  OPEN_SIDE,
  CLOSE_SIDE,
  OPEN_NEST,
  CLOSE_NEST,
  REQUEST_LOG_IN,
  RECEIVE_LOG_IN,
  REQUEST_LOG_OUT,
  RECEIVE_LOG_OUT,
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  UPDATE_PASSWORD_CONFIRM,
  REQUEST_SIGNUP,
  RECEIVE_SIGNUP
} from "../actions/actions";

const startState = {
  open: true,
  open_list: false,
  loading: false,
  items: [],
  access: localStorage.getItem("access"),
  refresh: localStorage.getItem("refresh"),
  id: localStorage.getItem("id"),
  loggedIn: false,
  loggingIn: false,
  email: localStorage.getItem("email"),
  password: "",
  passwordConfirm: "",
  chooseSettings: false
};

const reducer = (state = startState, action) => {
  switch (action.type) {
    case REQUEST_FEED:
      return { ...state, loading: true };
    case RECEIVE_INIT_FEED:
      return { ...state, items: action.json, loading: false };
    case RECEIVE_SEARCH_FEED:
      return { ...state, items: action.json, loading: false };
    case RECEIVE_TOPIC_FEED:
      return { ...state, items: action.json, loading: false };
    case RECEIVE_ML_FEED:
      return { ...state, items: action.json, loading: false };
    case OPEN_SIDE:
      return { ...state, open: true };
    case CLOSE_SIDE:
      return { ...state, open: false };
    case OPEN_NEST:
      return { ...state, open_list: true };
    case CLOSE_NEST:
      return { ...state, open_list: false };
    case REQUEST_SIGNUP:
      return { ...state };
    case RECEIVE_SIGNUP:
      return { ...state };
    case REQUEST_LOG_IN:
      return { ...state };
    case RECEIVE_LOG_IN:
      return {
        ...state,
        access: action.json.access_token,
        refresh: action.json.access_token,
        id: action.json.id_token
      };
    case UPDATE_EMAIL:
      return { ...state, email: action.str };
    case UPDATE_PASSWORD:
      return { ...state, password: action.str };
    case UPDATE_PASSWORD_CONFIRM:
      return { ...state, passwordConfirm: action.str };
    case REQUEST_LOG_OUT:
      return {
        ...state,
        access: null,
        refresh: null,
        id: null
      };
    default:
      return state;
  }
};
export default reducer;
