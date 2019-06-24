import $ from "jquery";
import { ActionCreators as UndoActionCreators } from "redux-undo";

export const KEY_CODE = {
  ESCAPE: 27,
  ENTER: 13,
  BACKSPACE: 8,
  DELETE: 46,
  Z: 90,
  CTRL: 17,
  SHIFT: 16,
  MAC_COMMAND: 91
};

/**
 * Calculates the width and height of text given the formatting specified in classes.
 * Width and Height are returned in doubles denoting their pixel dimensions.
 * 
 * @param {The text to calculate dimensions for.} text
 * @param {The CSS classes linked to the text, to take font-family and font-scaling into account.} classes
x1 */
export function calculateWordDimensions(text, classes) {
  classes = classes || [];

  // tag on our CSS class for an invisible HTML tag that calculates the width.
  classes.push("textDimensionCalculation");

  var div = document.createElement("div");
  div.setAttribute("class", classes.join(" "));

  $(div).html(text);

  document.body.appendChild(div);

  var dimensions = {
    width: $(div).outerWidth(),
    height: $(div).outerHeight()
  };

  div.parentNode.removeChild(div);

  return dimensions;
}

/** FOR UNDO REDO */
export const onUndo = () => dispatch => {
  dispatch(UndoActionCreators.undo());
};

export const onRedo = () => dispatch => {
  dispatch(UndoActionCreators.redo());
};

/** For redux IDs */

export function makeIDGenerator() {
  let i = 0;
  return function() {
    return i++;
  };
}
