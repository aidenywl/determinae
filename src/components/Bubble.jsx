import React from "react";
import { compose } from "redux";
import PropTypes from "prop-types";

import { connectActions } from "../reducers/configureStore";
import { updateFactorName } from "../actions/factors";

export const DEFAULT_BUBBLE_DIAMETER = 50;

class Bubble extends React.Component {
  getPositionStyle() {
    const { x, y } = this.props;
    return {
      top: y,
      left: x,
      width: DEFAULT_BUBBLE_DIAMETER,
      height: DEFAULT_BUBBLE_DIAMETER
    };
  }

  handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleFactorNameChange(event, bubbleId) {
    const newBubbleName = event.target.value;
    this.props.updateFactorName(bubbleId, newBubbleName);
  }

  render() {
    const bubbleId = this.props.id;

    return (
      <div
        className="bubble"
        style={this.getPositionStyle()}
        onClick={e => this.handleClick(e)}
      >
        <input
          className="factor-title"
          placeholder="Factor"
          type="text"
          onChange={event => this.handleFactorNameChange(event, bubbleId)}
          value={this.props.factor.name}
        />
      </div>
    );
  }
}

Bubble.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired
};

export default compose(
  connectActions({
    updateFactorName
  })
)(Bubble);
