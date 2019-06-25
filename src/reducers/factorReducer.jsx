import { combineReducers } from "redux";
import { connect } from "react-redux";
import undoable, { distinctState } from "redux-undo";
import { makeIDGenerator } from "../helpers";
import {
  CREATE_OPTION,
  UPDATE_FACTOR_OPTION_SCORE,
  DELETE_OPTION
} from "../actions/options";

import {
  CREATE_BUBBLE,
  UPDATE_BUBBLE_NAME,
  UPDATE_BUBBLE_POSITION,
  SELECT_BUBBLE,
  DELETE_BUBBLE,
  DESELECT_BUBBLE,
  LINK_BUBBLES
} from "../actions/factors";

/**
 * Factors are kept in a normalized data structure.
 *
 * The reason for normalizing the data into a flat shape is for these reasons:
 * - When a piece of data is duplicated in several places, it becomes harder to make sure that it is updated appropriately.
 * - Nested data means that the corresponding reducer logic has to be more nested or more complex. Updating a deeply nested field can become ugly. This is in the event that our bubble nests more data.
 * - Since immutable data updates require all ancestors in the state tree to be copied and updated as well, new object references will cause connected
 * UI components to re-render, an update to a deeply nested data object could force totally unrelated UI components to re-render even if the data they're displaying hasn't actually changed.
 */

const generateID = makeIDGenerator();

const DEFAULT_BUBBLE = {
  x: -1,
  y: -1,
  id: -1,
  name: "",
  parentFactorID: null,
  subfactors: [],
  optionScores: {}
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

/**
 * Helper function to map over objects and return a new object.
 */
function objectMap(object, mapFn) {
  return Object.keys(object).reduce((result, key) => {
    result[key] = mapFn(object[key]);
    return result;
  }, {});
}

/**
 * Helper function to change values of any option attributes of the bubble.
 *
 */
function _updateBubbleOptionScore(state, bubbleId, optionId, newScore) {
  // look up the factor.
  const factor = state[bubbleId];
  const previousOptionScores = factor.optionScores;

  const newOptionScore = {
    ...previousOptionScores,
    [optionId]: newScore
  };

  const newState = {
    ...state,
    [bubbleId]: {
      ...factor,
      optionScores: {
        ...newOptionScore
      }
    }
  };
  return newState;
}

const factorsById = (state = {}, action) => {
  switch (action.type) {
    case CREATE_BUBBLE:
      const bubbleID = "factor" + generateID();
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
      const parentFactorID = state[parentID];
      const subfactor = state[subfactorID];

      // If the parent and child are already linked, return.
      if (subfactor.parentFactorID === parentID) {
        return state;
      }

      let preppedState = state;
      // Remove the child's previous parent if any.
      const childPrevParent = state[state[subfactorID].parentFactorID];
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
        subfactors: [...parentFactorID.subfactors, subfactorID]
      });

      // update child node to point to parent.
      const upParentChildState = _updateBubbleAttribute(
        upParentState,
        subfactorID,
        {
          parentFactorID: parentID
        }
      );
      return upParentChildState;
    case CREATE_OPTION:
      let optionIdToCreate = action.id;
      const stateWithOptionAdded = objectMap(state, factor => {
        let currentOptionScores = factor.optionScores;
        return {
          ...factor,
          optionScores: {
            ...currentOptionScores,
            [optionIdToCreate]: 0
          }
        };
      });
      return stateWithOptionAdded;
    case UPDATE_FACTOR_OPTION_SCORE:
      let { bubbleId, optionId, score } = action;
      const stateWithOptionUpdated = _updateBubbleOptionScore(
        state,
        bubbleId,
        optionId,
        score,
        UPDATE_FACTOR_OPTION_SCORE
      );
      return stateWithOptionUpdated;
    case DELETE_OPTION:
      let optionIdToDelete = action.id;
      const stateWithOptionDeleted = objectMap(state, factor => {
        let currentOptionScores = factor.optionScores;
        // use ES6 destructuring assignment syntax to delete the factor.
        const {
          [optionIdToDelete]: toOmit,
          ...newOptionScores
        } = currentOptionScores;
        return {
          ...factor,
          optionScores: newOptionScores
        };
      });
      return stateWithOptionDeleted;
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

export const connectAllFactorsById = dstKey =>
  connect(({ factors }) => {
    return { [dstKey]: factors.present.factorsById };
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
