import { combineReducers } from "redux";
import { connect } from "react-redux";
import { makeIDGenerator } from "../helpers";
import {
  CREATE_OPTION,
  UPDATE_FACTOR_OPTION_SCORE,
  DELETE_OPTION
} from "../actions/options";

import {
  CREATE_FACTOR,
  UPDATE_FACTOR_NAME,
  UPDATE_FACTOR_POSITION,
  SELECT_FACTOR,
  DELETE_FACTOR,
  DESELECT_FACTOR,
  LINK_FACTORS,
  UPDATE_FACTOR_WEIGHTAGE
} from "../actions/factors";

/**
 * Factors are kept in a normalized data structure.
 *
 * The reason for normalizing the data into a flat shape is for these reasons:
 * - When a piece of data is duplicated in several places, it becomes harder to make sure that it is updated appropriately.
 * - Nested data means that the corresponding reducer logic has to be more nested or more complex. Updating a deeply nested field can become ugly. This is in the event that our factor nests more data.
 * - Since immutable data updates require all ancestors in the state tree to be copied and updated as well, new object references will cause connected
 * UI components to re-render, an update to a deeply nested data object could force totally unrelated UI components to re-render even if the data they're displaying hasn't actually changed.
 */

const generateID = makeIDGenerator();

const DEFAULT_FACTOR = {
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
 * Helper function to change the values of a factor identified by the id.
 *
 * @param {The state factorsbyId.} state
 * @param {The id of the factor whose values are to be changed.} factorId
 * @param {The new values of the factor.} newValues
 */
function _updateFactorAttribute(state, factorId, newValues) {
  // look up the correct factor
  const factor = state[factorId];
  const newState = {
    ...state,
    [factorId]: {
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
 * Helper function to change values of any option attributes of the factor.
 *
 */
function _updateFactorOptionScore(state, factorId, optionId, newScore) {
  // look up the factor.
  const factor = state[factorId];
  const previousOptionScores = factor.optionScores;

  const newOptionScore = {
    ...previousOptionScores,
    [optionId]: newScore
  };

  const newState = {
    ...state,
    [factorId]: {
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

  // Calculate the score for each option based on the score from the subfactors.
  optionIDs.forEach(optionID => {
    const sumScore = subfactorsData.reduce((total, subfactor) => {
      const subfactorRawScore = subfactor.optionScores[optionID];
      const subfactorWeightage = subfactor.weightage;
      const subfactorWeightedScore =
        (subfactorRawScore * subfactorWeightage) / 100;
      console.log(subfactorWeightedScore);
      return subfactorWeightedScore + total;
    }, 0);
    derivedOptionScores[optionID] = sumScore;
  });
  return derivedOptionScores;
}

const factorsById = (state = {}, action) => {
  switch (action.type) {
    case CREATE_FACTOR: {
      const factorID = "factor" + generateID();
      const factorData = {
        ...DEFAULT_FACTOR,
        id: factorID,
        ...action.position,
        optionScores: action.optionScores
      };
      return { ...state, [factorID]: factorData };
    }

    case UPDATE_FACTOR_NAME: {
      const newName = action.name;
      const stateWithUpdatedName = _updateFactorAttribute(state, action.id, {
        name: newName
      });
      return stateWithUpdatedName;
    }

    case UPDATE_FACTOR_POSITION: {
      const newPosition = action.position;
      const stateWithUpdatedPosition = _updateFactorAttribute(
        state,
        action.id,
        {
          x: newPosition.x,
          y: newPosition.y
        }
      );
      return stateWithUpdatedPosition;
    }

    case DELETE_FACTOR: {
      const factorIdToDelete = action.id;
      // using destructuring assignment syntax in ES6 to delete the factor.
      const {
        [factorIdToDelete]: factorToDelete,
        ...stateWithoutFactor
      } = state;
      let preppedState = stateWithoutFactor;

      // Remove the linkages to any other related factors.

      const parentFactorID = factorToDelete.parentFactorID;
      if (parentFactorID) {
        // removing the factor from the parent factor.
        preppedState = _updateFactorAttribute(preppedState, parentFactorID, {
          subfactors: preppedState[parentFactorID].subfactors.filter(id => {
            return id !== factorToDelete.id;
          })
        });
      }
      if (factorToDelete.subfactors) {
        factorToDelete.subfactors.forEach(subfactorID => {
          preppedState = _updateFactorAttribute(preppedState, subfactorID, {
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
        preppedState = _updateFactorAttribute(
          preppedState,
          factorToDelete.parentFactorID,
          {
            optionScores: updatedParentScores
          }
        );
      }

      return preppedState;
    }
    case LINK_FACTORS: {
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
        preppedState = _updateFactorAttribute(preppedState, subfactorID, {
          subfactors: newSubfactorChildren
        });

        preppedState = _updateFactorAttribute(preppedState, parentID, {
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
        preppedState = _updateFactorAttribute(
          preppedState,
          childPrevParent.id,
          {
            subfactors: newCPPSubfactor
          }
        );
      }

      // update parent node to point to child
      preppedState = _updateFactorAttribute(preppedState, parentID, {
        subfactors: [...parentFactor.subfactors, subfactorID]
      });

      // update child node to point to parent.
      preppedState = _updateFactorAttribute(preppedState, subfactorID, {
        parentFactorID: parentID
      });

      // recalculate parent score based on subfactors.
      const nextParentScore = _calculateDerivedOptionScores(
        preppedState,
        parentID
      );
      preppedState = _updateFactorAttribute(preppedState, parentID, {
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
      let { factorId, optionId, score } = action;
      let preppedState = _updateFactorOptionScore(
        state,
        factorId,
        optionId,
        score,
        UPDATE_FACTOR_OPTION_SCORE
      );

      // update the parent score if the factor has a parent.
      const parentID = preppedState[factorId].parentFactorID;

      if (parentID) {
        const updatedParentScores = _calculateDerivedOptionScores(
          preppedState,
          parentID
        );
        preppedState = _updateFactorAttribute(preppedState, parentID, {
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
      const stateWithUpdatedWeightage = _updateFactorAttribute(
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
    case SELECT_FACTOR:
      if (action.id === state) {
        return null;
      }
      return action.id;
    case DELETE_FACTOR:
      if (action.id === state) {
        return null;
      }
      return state;
    case DESELECT_FACTOR:
      return null;
    case LINK_FACTORS:
      return null;
    default:
      return state;
  }
};

/** Pretty connect methods */
export const connectAllFactors = dstKey =>
  connect(({ undoableData }) => {
    return {
      [dstKey]: Object.values(undoableData.present.factors.factorsById)
    };
  });

export const connectAllFactorsById = dstKey =>
  connect(({ undoableData }) => {
    return { [dstKey]: undoableData.present.factors.factorsById };
  });
export const connectSelectedFactor = dstKey => {
  return connect(({ undoableData }) => {
    // current selected ID
    const factors = undoableData.present.factors;
    const currentSelectedID = factors.selectedID;

    const factor = factors.factorsById[currentSelectedID];
    return { [dstKey]: factor };
  });
};

export const connectSelectedFactorID = dstKey => {
  connect(({ undoableData }) => {
    return { [dstKey]: undoableData.present.factors.selectedID };
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

export default factorData;
