import React from "react";
import { compose } from "redux";
import PropTypes from "prop-types";

import { connectActions } from "../reducers/configureStore";
import { updateFactorName, updateFactorPosition } from "../actions/factors";

export const DEFAULT_BUBBLE_DIAMETER = 50;

class Bubble extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dragOffsetX: 0,
      dragOffsetY: 0
    };
  }

  componentDidMount() {
    this.dragImg = new Image(0, 0);
    this.dragImg.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  }

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

  handleDragStart(event) {
    const getCanvasXY = this.props.getCanvasXY;
    // set x and y offset.
    const clickPosition = getCanvasXY(event.pageX, event.pageY);
    const bubbleCenterOffsetX = clickPosition.canvasX - this.props.x;
    const bubbleCenterOffsetY = clickPosition.canvasY - this.props.y;
    this.setState({
      dragOffsetX: bubbleCenterOffsetX,
      dragOffsetY: bubbleCenterOffsetY
    });
    // animate.
    event.dataTransfer.setDragImage(this.dragImg, 0, 0);
  }

  handleDragEnd(event) {
    // remove x and y offset
    this.setState({
      dragOffsetX: 0,
      dragOffsetY: 0
    });
    // deanimate.
  }

  handleOnDrag(event, bubbleId) {
    event.preventDefault();
    if (!event.pageX || !event.pageY) {
      return;
    }
    const getCanvasXY = this.props.getCanvasXY;
    const canvasPosition = getCanvasXY(event.pageX, event.pageY);

    this.props.updateFactorPosition(
      bubbleId,
      canvasPosition.canvasX - this.state.dragOffsetX,
      canvasPosition.canvasY - this.state.dragOffsetY
    );
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
        onDragStart={e => this.handleDragStart(e)}
        onDrag={e => this.handleOnDrag(e, bubbleId)}
        onDragEnd={e => this.handleDragEnd(e)}
        draggable="true"
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
    updateFactorName,
    updateFactorPosition
  })
)(Bubble);
