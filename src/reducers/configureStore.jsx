import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers,
  bindActionCreators
} from "redux";
import thunkMiddleware from "redux-thunk";
import { connect } from "react-redux";

import undoable, { excludeAction } from "redux-undo";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

import factors from "./factorReducer";
import options from "./optionReducer";
import { SELECT_FACTOR, DESELECT_FACTOR } from "../actions/factors";

/**
 * connectActions is used as syntactic sugar. To bring connect for actions in line with that used for reducers.
 *
 * @param {The action creators to connec to the redux store} functions
 * @param {The version of connect to use.} connectOverride
 */
export const connectActions = (functions = {}, connectOverride = connect) => {
  return connectOverride(undefined, mapDispatchHelper(functions));
};

const mapDispatchHelper = (functions = {}) => {
  return dispatch => {
    let outcome = {};
    Object.keys(functions).forEach(functionName => {
      outcome[functionName] = bindActionCreators(
        functions[functionName],
        dispatch
      );
    });
    return outcome;
  };
};

/** REDUX STATE SETUP */
const MOCK_INITIAL_STATE = {};

// Enable redux devtools.
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Enable undo-redo for factors and options.
const undoableData = undoable(
  combineReducers({
    factors,
    options
  }),
  {
    filter: excludeAction([SELECT_FACTOR, DESELECT_FACTOR, "persist/REHYDRATE"])
  }
);

const rootReducer = combineReducers({
  undoableData
});

// Persistence past refreshes using redux-persist.
const PERSIST_CONFIG = {
  key: "root",
  storage: storage,
  stateReconciler: autoMergeLevel2,
  debug: true,
  blacklist: ["undoableData", "past", "history", "present", "future"]
};

const persistedReducer = persistReducer(PERSIST_CONFIG, rootReducer);

export const store = createStore(
  persistedReducer,
  MOCK_INITIAL_STATE,
  composeEnhancers(applyMiddleware(thunkMiddleware))
);

export const persistor = persistStore(store);

window.persistor = persistor;
