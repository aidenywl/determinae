import { makeIDGenerator } from "../helpers";

export const CREATE_OPTION = "options.CREATE_OPTION";
export const UPDATE_OPTION_NAME = "options.UPDATE_OPTION_NAME";
export const DELETE_OPTION = "options.DELETE_OPTION";
export const UPDATE_FACTOR_OPTION_SCORE = "options.UPDATE_FACTOR_OPTION_SCORE";

const generateID = makeIDGenerator("options");

/**
 * Creates a new option in the application state.
 *
 * @param {The name of the option.} optionName
 */
export const createOption = () => {
  return {
    type: CREATE_OPTION,
    id: "option" + generateID()
  };
};

/**
 * Update the option with a new name.
 *
 * @param {The id of the option to be updated.} id
 * @param {The updated name of the option.} optionName
 */
export const updateOptionName = (id, optionName) => {
  return {
    type: UPDATE_OPTION_NAME,
    id,
    name: optionName
  };
};

/**
 * Deletes the option from the application state.
 *
 * @param {The id of the option to be deleted.} id
 */
export const deleteOption = id => {
  return {
    type: DELETE_OPTION,
    id
  };
};

/**
 * Updates the option score for the factor.
 * @param {The option ID to be updated.} optionId
 * @param {The id of the factor to be updated.} factorId
 * @param {The new score.} newScore
 */
export const updateScore = (optionId, factorId, newScore) => {
  return {
    type: UPDATE_FACTOR_OPTION_SCORE,
    factorId,
    optionId,
    score: newScore
  };
};
