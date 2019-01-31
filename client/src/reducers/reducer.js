import {
  REQUEST_FEED,
  RECEIVE_INIT_FEED,
  RECEIVE_SEARCH_FEED,
  RECEIVE_TOPIC_FEED,
  OPEN_SIDE,
  CLOSE_SIDE
} from "../actions/actions";

const reducer = (state = { open: true, loading: false, items: [] }, action) => {
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
    default:
      return state;
  }
};
export default reducer;
