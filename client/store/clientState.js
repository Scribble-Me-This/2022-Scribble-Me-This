const initialState = {};

// Action types
const GET_CLIENT_STATE = 'GET_CLIENT_STATE';

// Action Creators
export const getClientState = (clientState) => ({
  type: GET_CLIENT_STATE,
  clientState,
});


export default function clientState(state = initialState, action) {
  switch (action.type) {
    case GET_CLIENT_STATE:
      return {...state, game: action.clientState};
    default:
      return state;
  }
}