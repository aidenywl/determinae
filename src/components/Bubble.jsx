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
    // remove drag ghost.
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

    // Makes sure the bubble is sized right upon undo or redo.
    if (this.props.factor.name) {
      this.handleFactorNameChange(this.props.factor.name);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // For undo redo feature, to check if redux has been rolled back, and to update the position accordingly.
    if (this.props.x !== prevProps.x || this.props.y !== prevProps.y) {
      this.setState({
        x: this.props.x,
        y: this.props.y
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

  handleOnDrag(event) {
    event.preventDefault();
    if (!event.pageX || !event.pageY) {
      return;
    }
    const getCanvasXY = this.props.getCanvasXY;
    const canvasPosition = getCanvasXY(event.pageX, event.pageY);
    this.setState({
      x: canvasPosition.canvasX - this.state.dragOffsetX,
      y: canvasPosition.canvasY - this.state.dragOffsetY
    });
  }

  handleDragEnd(event) {
    // remove x and y offset
    this.setState({
      dragOffsetX: 0,
      dragOffsetY: 0
    });
    // deanimate.

    this.props.updateFactorPosition(this.props.id, this.state.x, this.state.y);
  }

  _updateFactorBubbleWidth(width) {
    this.setState({ currentWidth: width });
  }

  _updateFactorInputWidth(width) {
    this.setState({ currentInputWidth: width });
  }

  handleInputOnChange(event) {
    this.handleFactorNameChange(event.target.value, this.props.id);
  }

  handleFactorNameChange(newBubbleName, bubbleId) {
    var dimensions = calculateWordDimensions(newBubbleName, ["factor-title"]);

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
    return {
      top: this.state.y,
      left: this.state.x
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
    console.log("rerendering");
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
        onDrag={e => this.handleOnDrag(e)}
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
          onChange={event => this.handleInputOnChange(event)}
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
