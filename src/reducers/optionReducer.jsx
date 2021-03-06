import { combineReducers } from "redux";
import { connect } from "react-redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import {
  CREATE_OPTION,
  UPDATE_OPTION_NAME,
  DELETE_OPTION
} from "../actions/options";

const DEFAULT_OPTION = {
  id: -1,
  name: "",
  finalScore: 0
};

/**
 * Helper function to change the values of a option identified by the id.
 *
 * @param {The state optionList.} optionList
 * @param {The id of the option whose values are to be changed.} optionId
 * @param {The new values of the option.} newValues
 */
function _updateOptionAttribute(optionList, optionId, newValues) {
  const newState = optionList.map(option => {
    // If the option is not the one we want, return.
    if (option.id !== optionId) {
      return option;
    }
    return {
      ...option,
      ...newValues
    };
  });
  return newState;
}

const data = (state = [], action) => {
  switch (action.type) {
    case CREATE_OPTION:
      const optionData = {
        ...DEFAULT_OPTION,
        id: action.id
      };
      return [...state, optionData];
    case UPDATE_OPTION_NAME:
      const newName = action.name;
      const stateWithUpdatedName = _updateOptionAttribute(state, action.id, {
        name: newName
      });
      return stateWithUpdatedName;
    case DELETE_OPTION:
      const deletedOptionID = action.id;
      const stateWithDeletedOption = state.filter(
        option => option.id !== deletedOptionID
      );
      return stateWithDeletedOption;
    default:
      return state;
  }
};

/** Pretty connect methods */
export const connectAllOptions = dstKey =>
  connect(({ undoableData }) => {
    return { [dstKey]: undoableData.present.options.data };
  });

const optionData = combineReducers({ data });

const OPTION_PERSIST_CONFIG = {
  key: "options",
  storage: storage
};

export default persistReducer(OPTION_PERSIST_CONFIG, optionData);
