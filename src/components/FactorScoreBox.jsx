import React from "react";
import { compose } from "redux";
import PropTypes from "prop-types";

import { connectActions } from "../reducers/configureStore";
import { updateScore } from "../actions/options";
import { connectAllOptions } from "../reducers/optionReducer";
import { KEY_CODE } from "../helpers";
import NumericalInput from "./NumericalInput";

/**
 * `FactorScoreBox` is the interactive element for the factor's score.
 */

class FactorScoreBox extends React.Component {
  handleScoreChange(event) {
    event.preventDefault();
    const { optionId, factorId } = this.props;
    let value = event.target.value;
    if (isNaN(value)) {
      value = 0;
    }
    this.props.updateScore(optionId, factorId, parseFloat(value));
  }

  handleInputKeyDown(e) {
    e.stopPropagation();
    if (e.keyCode === KEY_CODE.ESCAPE || e.keyCode === KEY_CODE.ENTER) {
      e.target.blur();
      this.props.deselectFactor();
    }
  }
  render() {
    const { score, allOptions, optionId, factorId, disabled } = this.props;
    const inputID = `factor-score-${factorId}-${optionId}`;

    // getting the name.
    const name = allOptions.filter(el => {
      return el.id === optionId;
    })[0].name;
    return (
      <div className="scorebox">
        <h4>{name ? name : "OPTION"}</h4>
        <NumericalInput
          className="scorebox__input"
          value={score}
          onChange={e => this.handleScoreChange(e)}
          disabled={disabled}
          id={inputID}
          label="/10"
          onKeyDown={e => this.handleInputKeyDown(e)}
        />
      </div>
    );
  }
}

FactorScoreBox.propTypes = {
  score: PropTypes.any.isRequired,
  optionId: PropTypes.string.isRequired,
  factorId: PropTypes.string.isRequired
};
export default compose(
  connectActions({ updateScore }),
  connectAllOptions("allOptions")
)(FactorScoreBox);
