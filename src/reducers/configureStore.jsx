import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers,
  bindActionCreators
} from "redux";
import thunkMiddleware from "redux-thunk";
import { connect } from "react-redux";

import factors from "./factorReducer";
import options from "./optionReducer";
import undoable, { excludeAction } from "redux-undo";
import { SELECT_FACTOR, DESELECT_FACTOR } from "../actions/factors";

const MOCK_INITIAL_STATE = {};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const undoableData = undoable(
  combineReducers({
    factors,
    options
  }),
  {
    filter: excludeAction([SELECT_FACTOR, DESELECT_FACTOR])
  }
);

export const store = createStore(
  combineReducers({ undoableData }),
  MOCK_INITIAL_STATE,
  composeEnhancers(applyMiddleware(thunkMiddleware))
);

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
