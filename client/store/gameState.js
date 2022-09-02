const initialState = {};

// Action types
const GET_GAME_STATE = 'GET_GAME_STATE';

// Action Creators
export const getGameState = (gameState) => ({
  type: GET_GAME_STATE,
  gameState,
});

export default function gameState(state = initialState, action) {
  console.log('action', action, 'state', state)
  switch (action.type) {
    case GET_GAME_STATE:
      return {...state, game: action.gameState};
    default:
      return state;
  }
}