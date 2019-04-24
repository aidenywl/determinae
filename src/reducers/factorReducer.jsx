import { combineReducers } from "redux";
import { connect } from "react-redux";

import { CREATE_BUBBLE } from "../actions/factors";

let bubbleID = 0;

const data = (state = [], action) => {
  switch (action.type) {
    case CREATE_BUBBLE:
      const bubbleData = { ...action.position, id: bubbleID };
      bubbleID++;
      return [...state, bubbleData];
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
