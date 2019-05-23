import { combineReducers } from "redux";
import { connect } from "react-redux";

import {
  CREATE_CHOICE,
  UPDATE_CHOICE_NAME,
  DELETE_CHOICE
} from "../actions/choices";

let choiceID = 0;

/**
 * Helper function to change the values of a choice identified by the id.
 *
 * @param {The state choiceList.} choiceList
 * @param {The id of the choice whose values are to be changed.} choiceId
 * @param {The new values of the choice.} newValues
 */
function _updateChoiceAttribute(choiceList, choiceId, newValues) {
  const newState = choiceList.map(choice => {
    // If the choice is not the one we want, return.
    if (choice.id !== choiceId) {
      return choice;
    }
    return {
      ...choice,
      ...newValues
    };
  });
  return newState;
}

const data = (state = [], action) => {
  switch (action.type) {
    case CREATE_CHOICE:
      const choiceData = {
        name: action.name,
        id: choiceID
      };
      choiceID++;
      return { ...state, choiceData };
    case UPDATE_CHOICE_NAME:
      const newName = action.name;
      const stateWithUpdatedName = _updateChoiceAttribute(state, action.id, {
        name: newName
      });
      return stateWithUpdatedName;
    case DELETE_CHOICE:
      const deletedChoiceID = action.id;
      const stateWithDeletedChoice = state.filter(
        choice => choice.id !== deletedChoiceID
      );
      return stateWithDeletedChoice;
    default:
      return state;
  }
};

/** Pretty connect methods */
export const connectAllChoices = dstKey =>
  connect(({ choices }) => {
    return { [dstKey]: choices.data };
  });

export default combineReducers({ data });
