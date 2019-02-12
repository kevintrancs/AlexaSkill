import {
  REQUEST_FEED,
  RECEIVE_INIT_FEED,
  RECEIVE_SEARCH_FEED,
  RECEIVE_TOPIC_FEED,
  OPEN_SIDE,
  CLOSE_SIDE,
  OPEN_NEST,
  CLOSE_NEST
} from "../actions/actions";

const reducer = (state = { open: true, open_list: false, loading: false, items: [] }, action) => {
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
    case OPEN_NEST:
      return { ...state, open_list: true };
    case CLOSE_NEST:
      return { ...state, open_list: false}
    default:
      return state;
  }
};
export default reducer;
