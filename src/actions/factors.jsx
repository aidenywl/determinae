export const CREATE_FACTOR = "factors.CREATE_FACTOR";
export const UPDATE_FACTOR_NAME = "factors.UPDATE_FACTOR_NAME";
export const UPDATE_FACTOR_POSITION = "factors.UPDATE_FACTOR_POSITION";
export const SELECT_FACTOR = "factors.SELECT_FACTOR";
export const DELETE_FACTOR = "factors.DELETE_FACTOR";
export const DESELECT_FACTOR = "factors.DESELECT_FACTOR";
export const LINK_FACTORS = "factors.LINK_FACTORS";
export const UPDATE_FACTOR_WEIGHTAGE = "factors.UPDATE_FACTOR_WEIGHTAGE";

/**
 * Creates a new factor with the specified position.
 * The ID is assigned by the store.
 *
 * @param {x-position of the factor on the planning canvas.} x
 * @param {y-position of the factor on the planning canvas.} y
 */
export const createFactor = (x, y) => (dispatch, getState) => {
  const positionPayload = {
    x,
    y
  };
  const options = getState().undoableData.present.options.data;
  // convert options to id for creating factor.
  const optionMap = {};
  options.forEach(option => {
    optionMap[option.id] = 0;
  });

  dispatch({
    type: CREATE_FACTOR,
    position: positionPayload,
    optionScores: optionMap
  });
};

/**
 * Action for updating factor names to maintain controlled state for each factor.
 *
 * @param {The id of the factor to be updated.} id
 * @param {The new name.} name
 */
export const updateFactorName = (id, name) => {
  return {
    type: UPDATE_FACTOR_NAME,
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
    type: UPDATE_FACTOR_POSITION,
    id: id,
    position: {
      x,
      y
    }
  };
};

/**
 * Action called when a factor is selected.
 *
 * @param {The id of the selected factor.} id
 */
export const selectFactor = id => {
  return (dispatch, getState) => {
    const { undoableData } = getState();
    const selectedID = undoableData.present.factors.selectedID;

    // if no ID was previously selected, simply make the factor visibly selected.
    if (!selectedID && selectedID !== 0) {
      dispatch({
        type: SELECT_FACTOR,
        id: id
      });
      return;
    }

    // An ID was previously selected.
    if (id === selectedID) {
      // Factor was clicked again, signalling deselect.
      dispatch({
        type: DESELECT_FACTOR
      });
    } else if (id !== selectedID) {
      dispatch(linkParentToSubfactor(id, selectedID));
    }
  };
};

export const deselectFactor = () => {
  return {
    type: DESELECT_FACTOR
  };
};

/**
 * Action called when the factor is deleted.
 *
 * @param {The id of the factor to be deleted.} id
 */
export const deleteFactor = id => {
  return {
    type: DELETE_FACTOR,
    id: id
  };
};

export const linkParentToSubfactor = (parentID, subfactorID) => {
  return {
    type: LINK_FACTORS,
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
