import React from "react";
import { compose } from "redux";
import PropTypes from "prop-types";

import { connectActions } from "../reducers/configureStore";
import { updateScore } from "../actions/options";
import { connectAllOptions } from "../reducers/optionReducer";
import { KEY_CODE } from "../helpers";

/**
 * `FactorScoreBox` is the interactive element for the factor's score.
 */

class FactorScoreBox extends React.Component {
  handleScoreChange(event) {
    event.preventDefault();
    const { optionId, bubbleId } = this.props;
    let value = event.target.value;
    if (isNaN(value)) {
      value = 0;
    }
    this.props.updateScore(optionId, bubbleId, parseFloat(value));
  }

  handleInputKeyDown(e) {
    e.stopPropagation();
    if (e.keyCode === KEY_CODE.ESCAPE || e.keyCode === KEY_CODE.ENTER) {
      e.target.blur();
      this.props.deselectBubble();
    }
  }
  render() {
    const { score, allOptions, optionId, disabled } = this.props;
    // getting the name.
    const name = allOptions.filter(el => {
      return el.id === optionId;
    })[0].name;
    return (
      <div className="scorebox">
        <h4>{name ? name : "OPTION"}</h4>
        <input
          className="scorebox__input text__subheader"
          type="number"
          step="any"
          value={score}
          onChange={event => this.handleScoreChange(event)}
          onKeyDown={e => this.handleInputKeyDown(e)}
          disabled={disabled}
        />
      </div>
    );
  }
}

FactorScoreBox.propTypes = {
  score: PropTypes.any.isRequired,
  optionId: PropTypes.string.isRequired,
  bubbleId: PropTypes.string.isRequired
};
export default compose(
  connectActions({ updateScore }),
  connectAllOptions("allOptions")
)(FactorScoreBox);
