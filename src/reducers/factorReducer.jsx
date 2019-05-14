import { combineReducers } from "redux";
import { connect } from "react-redux";

import {
  CREATE_BUBBLE,
  UPDATE_BUBBLE_NAME,
  UPDATE_BUBBLE_POSITION
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
    default:
      return state;
  }
};

/** Pretty connect methods */
export const connectAllFactors = dstKey =>
  connect(({ factors }) => {
    return { [dstKey]: factors.data };
  });

export default combineReducers({ data });
