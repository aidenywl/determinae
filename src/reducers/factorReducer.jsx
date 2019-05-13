import { combineReducers } from "redux";
import { connect } from "react-redux";

import { CREATE_BUBBLE, UPDATE_BUBBLE_NAME } from "../actions/factors";

let bubbleID = 0;

const data = (state = [], action) => {
  switch (action.type) {
    case CREATE_BUBBLE:
      const bubbleData = { ...action.position, id: bubbleID, name: "" };
      bubbleID++;
      return [...state, bubbleData];
    case UPDATE_BUBBLE_NAME:
      const newName = action.name;
      const currentBubbleId = action.id;
      const newState = state.map(bubble => {
        // If the bubble is not the one we want, return.
        if (bubble.id !== currentBubbleId) {
          return bubble;
        }
        return {
          ...bubble,
          name: newName
        };
      });
      return newState;
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
