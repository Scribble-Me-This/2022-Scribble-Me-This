import axios from "axios";

/**
 * ACTION TYPES
 */
const SET_DATA = "SET_DATA";

/**
 * ACTION CREATORS
 */
const setData = (data) => ({ type: SET_DATA, data });

/**
 * THUNK CREATORS
 */
export const getData = () => async (dispatch) => {
  const data = await axios.get("/api/data", {});
  return dispatch(setData(res.data));
};

/**
 * REDUCER
 */
export default function (state = {}, action) {
  switch (action.type) {
    case SET_DATA:
      return action.data;
    default:
      return state;
  }
}
