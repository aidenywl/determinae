import React from "react";
import { compose } from "redux";
import PropTypes from "prop-types";

import { connectActions } from "../reducers/configureStore";
import { updateScore } from "../actions/options";
import { connectAllOptions } from "../reducers/optionReducer";

/**
 * `FactorScoreBox` is the interactive element for the factor's score.
 */

class FactorScoreBox extends React.Component {
  handleScoreChange(event) {
    const { optionId, bubbleId } = this.props;
    this.props.updateScore(optionId, bubbleId, event.target.value);
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
          type="text"
          value={score}
          onChange={event => this.handleScoreChange(event)}
          disabled={disabled}
        />
      </div>
    );
  }
}

FactorScoreBox.propTypes = {
  score: PropTypes.string.isRequired,
  optionId: PropTypes.string.isRequired,
  bubbleId: PropTypes.string.isRequired
};
export default compose(
  connectActions({ updateScore }),
  connectAllOptions("allOptions")
)(FactorScoreBox);
