import { combineReducers } from "redux";
import { connect } from "react-redux";

import { CREATE_BUBBLE } from "../actions/factors";

const data = (state = [], action) => {
  switch (action.type) {
    case CREATE_BUBBLE:
      return [...state, action.position];
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
