import { createStore, combineReducers, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import gameState from "./gameState";
import clientState from "./clientState";


const reducer = combineReducers({
  gameState: gameState,
  clientState: clientState,
});

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);
const store = createStore(reducer, middleware);
store.subscribe(() => {
  console.log("The store state changed. Here is the new state:", store.getState());
})

export default store;