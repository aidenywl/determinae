import { combineReducers } from "redux";
import { connect } from "react-redux";
import undoable, { distinctState } from "redux-undo";

import {
  CREATE_BUBBLE,
  UPDATE_BUBBLE_NAME,
  UPDATE_BUBBLE_POSITION,
  SELECT_BUBBLE,
  DELETE_BUBBLE,
  DESELECT_BUBBLE
} from "../actions/factors";

let bubbleID = 0;

/**
 * Helper function to change the values of a bubble identified by the id.
 *
 * @param {The state bubblelist.} bubbleList
 * @param {The id of the bubble whose values are to be changed.} bubbleId
 * @param {The new values of the bubble.} newValues
 */
function _updateBubbleAttribute(bubbleList, bubbleId, newValues) {
  const newState = bubbleList.map(bubble => {
    // If the bubble is not the one we want, return.
    if (bubble.id !== bubbleId) {
      return bubble;
    }
    return {
      ...bubble,
      ...newValues
    };
  });
  return newState;
}

const data = (state = [], action) => {
  switch (action.type) {
    case CREATE_BUBBLE:
      const bubbleData = { ...action.position, id: bubbleID, name: "" };
      bubbleID++;
      return [...state, bubbleData];
    case UPDATE_BUBBLE_NAME:
      const newName = action.name;
      const stateWithUpdatedName = _updateBubbleAttribute(state, action.id, {
        name: newName
      });
      return stateWithUpdatedName;
    case UPDATE_BUBBLE_POSITION:
      const newPosition = action.position;
      const stateWithUpdatedPosition = _updateBubbleAttribute(
        state,
        action.id,
        {
          x: newPosition.x,
          y: newPosition.y
        }
      );
      return stateWithUpdatedPosition;
    case DELETE_BUBBLE:
      const stateWithoutBubble = state.filter(
        factor => factor.id !== action.id
      );
      return stateWithoutBubble;
    default:
      return state;
  }
};

const selectedID = (state = null, action) => {
  switch (action.type) {
    case SELECT_BUBBLE:
      if (action.id === state) {
        return null;
      }
      return action.id;
    case DELETE_BUBBLE:
      if (action.id === state) {
        return null;
      }
      return state;
    case DESELECT_BUBBLE:
      return null;
    default:
      return state;
  }
};

/** Pretty connect methods */
export const connectAllFactors = dstKey =>
  connect(({ factors }) => {
    return { [dstKey]: factors.present.data };
  });

export const connectSelectedFactor = dstKey => {
  return connect(({ factors }) => {
    const bubble = factors.present.data.find(
      factor => factor.id === factors.present.selectedID
    );
    return { [dstKey]: bubble };
  });
};

export const connectSelectedFactorID = dstKey => {
  connect(({ factors }) => {
    return { [dstKey]: factors.present.selectedID };
  });
};

const factorData = combineReducers({
  data,
  selectedID
});

/**
 * Enhances factor reducers to make them undoable only if a state change occurs to them.
 *
 * Using distinctState() saves space in the history array.
 */

const undoableFactorData = undoable(factorData, {
  filter: distinctState()
});

export default undoableFactorData;
