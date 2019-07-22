export const CREATE_BUBBLE = "factors.CREATE_BUBBLE";
export const UPDATE_BUBBLE_NAME = "factors.UPDATE_BUBBLE_NAME";
export const UPDATE_BUBBLE_POSITION = "factors.UPDATE_BUBBLE_POSITION";
export const SELECT_BUBBLE = "factors.SELECT_BUBBLE";
export const DELETE_BUBBLE = "factors.DELETE_BUBBLE";
export const DESELECT_BUBBLE = "factors.DESELECT_BUBBLE";
export const LINK_BUBBLES = "factors.LINK_BUBBLES";
export const UPDATE_FACTOR_WEIGHTAGE = "factors.UPDATE_FACTOR_WEIGHTAGE";

/**
 * Creates a new factor with the specified position.
 * The ID is assigned by the store.
 *
 * @param {x-position of the bubble on the planning canvas.} x
 * @param {y-position of the bubble on the planning canvas.} y
 */
export const createBubble = (x, y) => (dispatch, getState) => {
  const positionPayload = {
    x,
    y
  };
  const options = getState().options.data;
  // convert options to id for creating bubble.
  const optionMap = {};
  options.forEach(option => {
    optionMap[option.id] = 0;
  });

  dispatch({
    type: CREATE_BUBBLE,
    position: positionPayload,
    optionScores: optionMap
  });
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
  return (dispatch, getState) => {
    const { factors } = getState();
    const selectedID = factors.present.selectedID;

    // if no ID was previously selected, simply make the bubble visibly selected.
    if (!selectedID && selectedID !== 0) {
      dispatch({
        type: SELECT_BUBBLE,
        id: id
      });
      return;
    }

    // An ID was previously selected.
    if (id === selectedID) {
      // Bubble was clicked again, signalling deselect.
      dispatch({
        type: DESELECT_BUBBLE
      });
    } else if (id !== selectedID) {
      dispatch(linkParentToSubfactor(id, selectedID));
    }
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

export const linkParentToSubfactor = (parentID, subfactorID) => {
  return {
    type: LINK_BUBBLES,
    payload: {
      parentID,
      subfactorID
    }
  };
};

export const updateWeightage = (factorId, newWeightage) => {
  return {
    type: UPDATE_FACTOR_WEIGHTAGE,
    factorId,
    weightage: newWeightage
  };
};
