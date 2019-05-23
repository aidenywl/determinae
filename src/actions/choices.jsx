export const CREATE_CHOICE = "choices.CREATE_CHOICE";
export const UPDATE_CHOICE_NAME = "choices.UPDATE_CHOICE_NAME";
export const DELETE_CHOICE = "choices.DELETE_CHOICE";

/**
 * Creates a new choice in the application state.
 *
 * @param {The name of the choice.} choiceName
 */
export const createChoice = choiceName => {
  return {
    type: CREATE_CHOICE,
    name: choiceName
  };
};

/**
 * Update the choice with a new name.
 *
 * @param {The id of the choice to be updated.} id
 * @param {The updated name of the choice.} choiceName
 */
export const updateChoiceName = (id, choiceName) => {
  return {
    type: UPDATE_CHOICE_NAME,
    id,
    name: choiceName
  };
};

/**
 * Deletes the choice from the application state.
 *
 * @param {The id of the choice to be deleted.} id
 */
export const deleteChoice = id => {
  return {
    type: DELETE_CHOICE,
    id
  };
};
