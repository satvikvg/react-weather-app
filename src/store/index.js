import app from "./app/reducer";
import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";

const rootReducer = combineReducers({ app });
const store = createStore(rootReducer, applyMiddleware(thunk));
export default store;
