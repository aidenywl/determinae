import React from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import ClassNames from "classnames";

import { connectActions } from "../reducers/configureStore";
import {
  updateFactorName,
  updateFactorPosition,
  selectBubble,
  deleteBubble,
  deselectBubble
} from "../actions/factors";
import { calculateWordDimensions, KEY_CODE } from "../helpers";

export const DEFAULT_BUBBLE_DIAMETER = 40;

const DEFAULT_WIDTH = DEFAULT_BUBBLE_DIAMETER * 2.5;
const DEFAULT_HEIGHT = DEFAULT_BUBBLE_DIAMETER;
const BUBBLE_INPUT_PLACEHOLDER = "FACTOR";

class Bubble extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      currentWidth: DEFAULT_WIDTH,
      currentHeight: DEFAULT_HEIGHT,
      dragOffsetX: 0,
      dragOffsetY: 0,
      fontSize: 15,
      currentInputWidth: 0,
      DEFAULT_INPUT_WIDTH: 0
    };
    this.titleInputRef = React.createRef();
    this.bubbleRef = React.createRef();
  }

  componentDidMount() {
    this.dragImg = new Image(0, 0);
    this.dragImg.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    // set position.
    const { x, y } = this.props;
    this.setState({
      x,
      y
    });

    // Input ref has loaded.
    if (this.titleInputRef.current) {
      // check fontsize and set in component state.
      let fontSize = parseFloat(
        window
          .getComputedStyle(this.titleInputRef.current, null)
          .getPropertyValue("font-size")
      );
      let inputPlaceholderWidth =
        (BUBBLE_INPUT_PLACEHOLDER.length - 2) * fontSize; // 2 is used to fit the factor properly.
      this.setState({
        fontSize,
        currentInputWidth: inputPlaceholderWidth,
        DEFAULT_INPUT_WIDTH: inputPlaceholderWidth
      });
    }
  }

  handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    // Send selected.
    this.props.selectBubble(this.props.id);
    this.bubbleRef.current.focus();
  }

  handleInputClick(event) {
    event.preventDefault();
    event.stopPropagation();

    this.titleInputRef.current.focus();
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

  _updateFactorBubbleWidth(width) {
    this.setState({ currentWidth: width });
  }

  _updateFactorInputWidth(width) {
    this.setState({ currentInputWidth: width });
  }

  handleFactorNameChange(event, bubbleId) {
    const newBubbleName = event.target.value;
    var dimensions = calculateWordDimensions(event.target.value, [
      "factor-title"
    ]);

    var textWidth = dimensions.width + 3;

    if (textWidth + 40 > DEFAULT_WIDTH) {
      this._updateFactorBubbleWidth(textWidth + 40);
    } else {
      this._updateFactorBubbleWidth(DEFAULT_WIDTH);
    }

    if (dimensions.width === 0) {
      this._updateFactorInputWidth(this.state.DEFAULT_INPUT_WIDTH);
    } else {
      this._updateFactorInputWidth(textWidth);
    }

    this.props.updateFactorName(bubbleId, newBubbleName);
  }

  /** STYLE METHODS */

  _getPositionStyle() {
    const { x, y } = this.props;
    return {
      top: y,
      left: x
    };
  }

  handleInputKeyDown(e) {
    if (e.keyCode === KEY_CODE.ESCAPE || e.keyCode === KEY_CODE.ENTER) {
      e.target.blur();
      this.props.deselectBubble();
    }
  }

  handleKeyDown(e) {
    this.handleInputKeyDown(e);
    if (e.keyCode === KEY_CODE.DELETE || e.keyCode === KEY_CODE.BACKSPACE) {
      this.props.deleteBubble(this.props.id);
    }
  }

  render() {
    const bubbleId = this.props.id;
    const isSelected = this.props.isSelected;
    const bubbleStyles = {
      ...this._getPositionStyle(),
      width: this.state.currentWidth,
      height: this.state.currentHeight
    };

    const inputStyles = {
      width: this.state.currentInputWidth
    };
    return (
      <div
        className={ClassNames({ bubble: true, "bubble-selected": isSelected })}
        style={bubbleStyles}
        onClick={e => this.handleClick(e)}
        onDragStart={e => this.handleDragStart(e)}
        onDrag={e => this.handleOnDrag(e, bubbleId)}
        onDragEnd={e => this.handleDragEnd(e)}
        draggable="true"
        onKeyDown={e => this.handleKeyDown(e)}
        tabIndex="0"
        ref={this.bubbleRef}
      >
        <input
          ref={this.titleInputRef}
          className="factor-title"
          placeholder={BUBBLE_INPUT_PLACEHOLDER}
          type="text"
          onChange={event => this.handleFactorNameChange(event, bubbleId)}
          value={this.props.factor.name}
          style={inputStyles}
          onKeyDown={e => this.handleInputKeyDown(e)}
          onClick={e => this.handleInputClick(e)}
        />
      </div>
    );
  }
}

Bubble.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired
};

export default compose(
  connectActions({
    updateFactorName,
    updateFactorPosition,
    selectBubble,
    deselectBubble,
    deleteBubble
  })
)(Bubble);
