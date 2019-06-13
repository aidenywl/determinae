import { combineReducers } from "redux";
import { connect } from "react-redux";
import undoable, { distinctState } from "redux-undo";

import {
  CREATE_BUBBLE,
  UPDATE_BUBBLE_NAME,
  UPDATE_BUBBLE_POSITION,
  SELECT_BUBBLE,
  DELETE_BUBBLE,
  DESELECT_BUBBLE,
  LINK_BUBBLES
} from "../actions/factors";

function makeIDGenerator() {
  let i = 0;
  return function() {
    return i++;
  };
}

const generateID = makeIDGenerator();

const DEFAULT_BUBBLE = {
  x: -1,
  y: -1,
  id: -1,
  name: "",
  parentFactor: null,
  subfactors: []
};

/**
 * Helper function to change the values of a bubble identified by the id.
 *
 * @param {The state factorsbyId.} state
 * @param {The id of the bubble whose values are to be changed.} bubbleId
 * @param {The new values of the bubble.} newValues
 */
function _updateBubbleAttribute(state, bubbleId, newValues) {
  // look up the correct factor
  const factor = state[bubbleId];
  const newState = {
    ...state,
    [bubbleId]: {
      ...factor,
      ...newValues
    }
  };
  return newState;
}

const factorsById = (state = {}, action) => {
  switch (action.type) {
    case CREATE_BUBBLE:
      const bubbleID = generateID();
      const bubbleData = {
        ...DEFAULT_BUBBLE,
        id: bubbleID,
        ...action.position
      };
      return { ...state, [bubbleID]: bubbleData };
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
      const factorIdToDelete = action.id;
      // using destructuring assignment syntax in ES6 to delete the factor.
      const { [factorIdToDelete]: toOmit, ...stateWithoutBubble } = state;
      return stateWithoutBubble;
    case LINK_BUBBLES:
      const { parentID, subfactorID } = action.payload;
      const parentFactor = state[parentID];
      const subfactor = state[subfactorID];

      // If the parent and child are already linked, return.
      if (subfactor.parentFactor === parentID) {
        return state;
      }

      let preppedState = state;
      // Remove the child's previous parent if any.
      const childPrevParent = state[state[subfactorID].parentFactor];
      if (childPrevParent) {
        const newCPPSubfactor = childPrevParent.subfactors.filter(sfID => {
          return sfID !== subfactorID;
        });
        // Make sure that the child node's previous parent no longer has the subfactor.
        preppedState = _updateBubbleAttribute(state, childPrevParent.id, {
          subfactors: newCPPSubfactor
        });
      }
      // update parent node to point to child
      const upParentState = _updateBubbleAttribute(preppedState, parentID, {
        subfactors: [...parentFactor.subfactors, subfactorID]
      });

      // update child node to point to parent.
      const upParentChildState = _updateBubbleAttribute(
        upParentState,
        subfactorID,
        {
          parentFactor: parentID
        }
      );
      return upParentChildState;
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
    case LINK_BUBBLES:
      return null;
    default:
      return state;
  }
};

/** Pretty connect methods */
export const connectAllFactors = dstKey =>
  connect(({ factors }) => {
    return { [dstKey]: Object.values(factors.present.factorsById) };
  });

export const connectSelectedFactor = dstKey => {
  return connect(({ factors }) => {
    // current selected ID
    const currentSelectedID = factors.present.selectedID;

    const bubble = factors.present.factorsById[currentSelectedID];
    return { [dstKey]: bubble };
  });
};

export const connectSelectedFactorID = dstKey => {
  connect(({ factors }) => {
    return { [dstKey]: factors.present.selectedID };
  });
};

const factorData = combineReducers({
  factorsById,
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
