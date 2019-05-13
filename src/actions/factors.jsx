export const CREATE_BUBBLE = "factors.CREATE_BUBBLE";
export const UPDATE_BUBBLE_NAME = "factors.UPDATE_BUBBLE_NAME";

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
