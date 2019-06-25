import React from "react";
import { compose } from "redux";
import PropTypes from "prop-types";

import { connectActions } from "../reducers/configureStore";
import { updateScore } from "../actions/options";

class ScoreBox extends React.Component {
  handleScoreChange(event) {
    const { optionId, bubbleId } = this.props;
    this.props.updateScore(optionId, bubbleId, event.target.value);
  }
  render() {
    const { score } = this.props;

    return (
      <div className="scorebox">
        <input
          className="scorebox__input"
          type="text"
          value={score}
          onChange={event => this.handleScoreChange(event)}
        />
      </div>
    );
  }
}

ScoreBox.propTypes = {
  score: PropTypes.number.isRequired,
  optionId: PropTypes.string.isRequired,
  bubbleId: PropTypes.string.isRequired
};
export default compose(connectActions({ updateScore }))(ScoreBox);
