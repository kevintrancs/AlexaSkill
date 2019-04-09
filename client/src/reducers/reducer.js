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
  RECEIVE_SIGNUP,
  RECIEVE_BOOKMARKS,
  REQUEST_BOOKMARKS,
  ADD_BOOKMARKS,
  ADD_HISTORY,
  ADD_LIKES,
  ADD_DISLIKES,
  REQUEST_HISTORY,
  RECEIVE_HISTORY,
  RECEIVE_BOOKMARKS_FEED,
  REQUEST_LIKES,
  RECEIVE_LIKES,
  REQUEST_DISLIKES,
  RECEIVE_DISLIKES,
  REMOVE_BOOKMARKS,
  REMOVE_LIKES,
  REMOVE_DISLIKES,
} from "../actions/actions";


const startState = {
  open: true,
  open_list: false,
  loading: false,
  items: [],
  bookmarks: [],
  likes: [],
  dislikes: [],
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
    case RECEIVE_BOOKMARKS_FEED:
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
    case REQUEST_BOOKMARKS:
      return { ...state, loading: true };
    case RECIEVE_BOOKMARKS:
      return { ...state, loading: false, bookmarks: action.json };
    case ADD_BOOKMARKS:
      return { ...state };
    case REMOVE_BOOKMARKS:
      return { ...state };
    case ADD_LIKES:
      return { ...state };
    case REMOVE_LIKES:
      return { ...state };
    case ADD_DISLIKES:
      return { ...state };
    case REMOVE_DISLIKES:
      return { ...state };
    case ADD_HISTORY:
      return { ...state };
    case REQUEST_HISTORY:
      return { ...state, loading: true };
    case RECEIVE_HISTORY:
      return { ...state, loading: false, items: action.json };
    case REQUEST_LIKES:
      return { ...state };
    case RECEIVE_LIKES:
      return { ...state, likes: action.json };
    case REQUEST_DISLIKES:
      return { ...state };
    case RECEIVE_DISLIKES:
      return { ...state, dislikes: action.json };
    
    default:
      return state;
  }
};
export default reducer;
