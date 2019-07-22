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
  LINK_BUBBLES,
  UPDATE_FACTOR_WEIGHTAGE
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
  optionScores: {},
  weightage: 0
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

function _calculateDerivedOptionScores(factorsById, factorId) {
  const factor = factorsById[factorId];
  const { subfactors } = factor;
  const optionIDs = Object.keys(factor.optionScores);

  if (subfactors.length === 0) {
    return factor.optionScores;
  }

  const subfactorsData = subfactors.map(subfactorID => {
    return factorsById[subfactorID];
  });
  let derivedOptionScores = {};

  optionIDs.forEach(optionID => {
    const sumScore = subfactorsData.reduce((total, subfactor) => {
      return subfactor.optionScores[optionID] + total;
    }, 0);
    derivedOptionScores[optionID] = sumScore;
  });
  return derivedOptionScores;
}

const factorsById = (state = {}, action) => {
  switch (action.type) {
    case CREATE_BUBBLE: {
      const bubbleID = "factor" + generateID();
      const bubbleData = {
        ...DEFAULT_BUBBLE,
        id: bubbleID,
        ...action.position,
        optionScores: action.optionScores
      };
      return { ...state, [bubbleID]: bubbleData };
    }

    case UPDATE_BUBBLE_NAME: {
      const newName = action.name;
      const stateWithUpdatedName = _updateBubbleAttribute(state, action.id, {
        name: newName
      });
      return stateWithUpdatedName;
    }

    case UPDATE_BUBBLE_POSITION: {
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
    }

    case DELETE_BUBBLE: {
      const factorIdToDelete = action.id;
      // using destructuring assignment syntax in ES6 to delete the factor.
      const {
        [factorIdToDelete]: factorToDelete,
        ...stateWithoutBubble
      } = state;
      let preppedState = stateWithoutBubble;

      // Remove the linkages to any other related factors.

      const parentFactorID = factorToDelete.parentFactorID;
      if (parentFactorID) {
        // removing the factor from the parent factor.
        preppedState = _updateBubbleAttribute(preppedState, parentFactorID, {
          subfactors: preppedState[parentFactorID].subfactors.filter(id => {
            return id !== factorToDelete.id;
          })
        });
      }
      if (factorToDelete.subfactors) {
        factorToDelete.subfactors.forEach(subfactorID => {
          preppedState = _updateBubbleAttribute(preppedState, subfactorID, {
            parentFactorID: null
          });
        });
      }

      // if the factor to delete has a parent, update the the score.
      if (parentFactorID) {
        const updatedParentScores = _calculateDerivedOptionScores(
          preppedState,
          parentFactorID
        );
        preppedState = _updateBubbleAttribute(
          preppedState,
          factorToDelete.parentFactorID,
          {
            optionScores: updatedParentScores
          }
        );
      }

      return preppedState;
    }
    case LINK_BUBBLES: {
      const { parentID, subfactorID } = action.payload;
      const parentFactor = state[parentID];
      const subfactor = state[subfactorID];

      // If the parent and child are already linked, return.
      if (subfactor.parentFactorID === parentID) {
        return state;
      }

      let preppedState = state;
      // If the new parent and subfactor are linked in an opposite relationship,
      // clear the subfactor relationship from the new subfactor.
      // clear the parent relationship from the new parentFactor
      if (parentFactor.parentFactorID === subfactorID) {
        const newSubfactorChildren = subfactor.subfactors.filter(obj => {
          return obj !== parentID;
        });
        preppedState = _updateBubbleAttribute(preppedState, subfactorID, {
          subfactors: newSubfactorChildren
        });

        preppedState = _updateBubbleAttribute(preppedState, parentID, {
          parentFactorID: null
        });
      }

      // Remove the subfactor's previous parent if any.
      const childPrevParent = state[state[subfactorID].parentFactorID];
      if (childPrevParent) {
        const newCPPSubfactor = childPrevParent.subfactors.filter(sfID => {
          return sfID !== subfactorID;
        });
        // Make sure that the child node's previous parent no longer has the subfactor.
        preppedState = _updateBubbleAttribute(
          preppedState,
          childPrevParent.id,
          {
            subfactors: newCPPSubfactor
          }
        );
      }

      // update parent node to point to child
      preppedState = _updateBubbleAttribute(preppedState, parentID, {
        subfactors: [...parentFactor.subfactors, subfactorID]
      });

      // update child node to point to parent.
      preppedState = _updateBubbleAttribute(preppedState, subfactorID, {
        parentFactorID: parentID
      });

      // recalculate parent score based on subfactors.
      const nextParentScore = _calculateDerivedOptionScores(
        preppedState,
        parentID
      );
      preppedState = _updateBubbleAttribute(preppedState, parentID, {
        optionScores: nextParentScore
      });
      return preppedState;
    }
    case CREATE_OPTION: {
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
    }
    case UPDATE_FACTOR_OPTION_SCORE: {
      let { bubbleId, optionId, score } = action;
      let preppedState = _updateBubbleOptionScore(
        state,
        bubbleId,
        optionId,
        score,
        UPDATE_FACTOR_OPTION_SCORE
      );

      // update the parent score if the bubble has a parent.
      const parentID = preppedState[bubbleId].parentFactorID;

      if (parentID) {
        const updatedParentScores = _calculateDerivedOptionScores(
          preppedState,
          parentID
        );
        preppedState = _updateBubbleAttribute(preppedState, parentID, {
          optionScores: updatedParentScores
        });
      }
      return preppedState;
    }
    case DELETE_OPTION: {
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
    }
    case UPDATE_FACTOR_WEIGHTAGE: {
      const { factorId, weightage } = action;
      const stateWithUpdatedWeightage = _updateBubbleAttribute(
        state,
        factorId,
        {
          weightage: weightage
        }
      );
      return stateWithUpdatedWeightage;
    }
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
