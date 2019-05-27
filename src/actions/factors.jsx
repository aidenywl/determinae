export const CREATE_BUBBLE = "factors.CREATE_BUBBLE";
export const UPDATE_BUBBLE_NAME = "factors.UPDATE_BUBBLE_NAME";
export const UPDATE_BUBBLE_POSITION = "factors.UPDATE_BUBBLE_POSITION";
export const SELECT_BUBBLE = "factors.SELECT_BUBBLE";
export const DELETE_BUBBLE = "factors.DELETE_BUBBLE";
export const DESELECT_BUBBLE = "factors.DESELECT_BUBBLE";

/**
 * Creates a new factor with the specified position.
 * The ID is assigned by the store.
 *
 * @param {x-position of the bubble on the planning canvas.} x
 * @param {y-position of the bubble on the planning canvas.} y
 */
export const createBubble = (x, y) => {
  const positionPayload = {
    x,
    y
  };
  return {
    type: CREATE_BUBBLE,
    position: positionPayload
  };
};

/**
 * Action for updating bubble names to maintain controlled state for each bubble.
 *
 * @param {The id of the factor to be updated.} id
 * @param {The new name.} name
 */
export const updateFactorName = (id, name) => {
  return {
    type: UPDATE_BUBBLE_NAME,
    id: id,
    name: name
  };
};

/**
 * Updates the position of the factor.
 *
 * @param {The id of the factor to be updated.} id
 * @param {The new x-position.} x
 * @param {The new y-position.} y
 */
export const updateFactorPosition = (id, x, y) => {
  return {
    type: UPDATE_BUBBLE_POSITION,
    id: id,
    position: {
      x,
      y
    }
  };
};

/**
 * Action called when a bubble is selected.
 *
 * @param {The id of the selected bubble.} id
 */
export const selectBubble = id => {
  return {
    type: SELECT_BUBBLE,
    id: id
  };
};

export const deselectBubble = () => {
  return {
    type: DESELECT_BUBBLE
  };
};

/**
 * Action called when the bubble is deleted.
 *
 * @param {The id of the bubble to be deleted.} id
 */
export const deleteBubble = id => {
  return {
    type: DELETE_BUBBLE,
    id: id
  };
};
