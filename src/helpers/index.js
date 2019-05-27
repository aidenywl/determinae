import $ from "jquery";

export const KEY_CODE = {
  ESCAPE: 27,
  ENTER: 13,
  BACKSPACE: 8,
  DELETE: 46
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
