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
  deselectBubble,
  linkParentToSubfactor
} from "../actions/factors";
import { calculateWordDimensions, KEY_CODE } from "../helpers";
import FactorScoreBox from "./FactorScoreBox";

const DEFAULT_BUBBLE_DIAMETER = 40;

export const DEFAULT_WIDTH = DEFAULT_BUBBLE_DIAMETER * 2.5;
export const DEFAULT_HEIGHT = DEFAULT_BUBBLE_DIAMETER;
const BUBBLE_INPUT_PLACEHOLDER = "FACTOR";

class Bubble extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      left: 0,
      top: 0,
      dragOffsetX: 0,
      dragOffsetY: 0,
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
    this.setPositionState(x, y);

    // check fontsize and set in component state.
    let fontSize = parseFloat(
      window
        .getComputedStyle(this.titleInputRef.current, null)
        .getPropertyValue("font-size")
    );
    let inputPlaceholderWidth =
      (BUBBLE_INPUT_PLACEHOLDER.length - 2) * fontSize; // 2 is used to fit the factor properly.
    this.setState({
      currentInputWidth: inputPlaceholderWidth,
      DEFAULT_INPUT_WIDTH: inputPlaceholderWidth
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // For undo redo feature, to always keep the position state up to date.
    // Without this, redux rolling back causes props to change but not the state that the position relies on.
    if (this.props.x !== prevProps.x || this.props.y !== prevProps.y) {
      this.setPositionState(this.props.x, this.props.y);
    }
  }

  setPositionState(newX, newY) {
    this.setState({
      left: newX - DEFAULT_WIDTH / 2,
      top: newY - DEFAULT_HEIGHT / 2
    });
  }

  handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    // Send selected.
    this.props.selectBubble(this.props.id);
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
    const newX = canvasPosition.canvasX - this.state.dragOffsetX;
    const newY = canvasPosition.canvasY - this.state.dragOffsetY;
    this.setPositionState(newX, newY);
  }

  handleDragEnd(event) {
    // remove x and y offset
    this.setState({
      dragOffsetX: 0,
      dragOffsetY: 0
    });
    // deanimate.
    this.props.updateFactorPosition(
      this.props.id,
      this.state.left + DEFAULT_WIDTH / 2,
      this.state.top + DEFAULT_HEIGHT / 2
    );
  }

  handleInputOnChange(event) {
    event.preventDefault();
    this.props.updateFactorName(this.props.id, event.target.value);
  }

  /** For sizing factor */
  calculateContainerWidth(name) {
    let dimensions = calculateWordDimensions(name, ["factor-title"]);
    let textWidth = dimensions.width + 3;

    if (textWidth + 40 > DEFAULT_WIDTH) {
      return textWidth + 40;
    } else {
      return DEFAULT_WIDTH;
    }
  }

  calculateInputWidth(name) {
    let dimensions = calculateWordDimensions(name, ["factor-title"]);
    let textWidth = dimensions.width + 3;

    if (dimensions.width === 0) {
      return this.state.DEFAULT_INPUT_WIDTH;
    } else {
      return textWidth;
    }
  }

  /** STYLE METHODS */

  _getPositionStyle() {
    return {
      top: this.state.top,
      left: this.state.left
    };
  }

  _getBubbleDimensions() {
    let newContainerWidth = DEFAULT_WIDTH;
    let newContainerHeight = DEFAULT_HEIGHT;
    // handling factors.
    const currentFactorName = this.props.factor.name;
    const factorNameWidth = this.calculateContainerWidth(currentFactorName);

    // handling options.
    const { optionScores } = this.props.factor;
    const optionsWidth = Object.keys(optionScores).length * 135;
    if (optionsWidth > factorNameWidth) {
      newContainerWidth = optionsWidth;
    } else {
      newContainerWidth = factorNameWidth;
    }

    if (optionsWidth) {
      newContainerHeight = DEFAULT_HEIGHT + 45;
    }
    return {
      width: newContainerWidth,
      height: newContainerHeight,
      marginLeft: -(newContainerWidth - DEFAULT_WIDTH) / 2
    };
  }

  handleInputKeyDown(e) {
    e.stopPropagation();
    if (e.keyCode === KEY_CODE.ESCAPE || e.keyCode === KEY_CODE.ENTER) {
      e.target.blur();
      this.props.deselectBubble();
    }
  }

  handleKeyDown(e) {
    if (e.keyCode === KEY_CODE.DELETE || e.keyCode === KEY_CODE.BACKSPACE) {
      this.props.deleteBubble(this.props.id);
    }
  }

  /**
   * Renders the score boxes for each option.
   */
  _renderScoreBoxes() {
    const { optionScores } = this.props.factor;
    return Object.keys(optionScores).map(optionId => {
      const optionScore = optionScores[optionId];
      return (
        <FactorScoreBox
          key={optionId}
          optionId={optionId}
          bubbleId={this.props.id}
          score={optionScore}
          disabled={this._hasSubfactors()}
        />
      );
    });
  }

  _hasSubfactors() {
    const { subfactors } = this.props.factor;
    if (subfactors.length > 0) {
      return true;
    }
    return false;
  }
  render() {
    const isSelected = this.props.isSelected;
    const currentFactorName = this.props.factor.name;
    const newInputWidth = this.calculateInputWidth(currentFactorName);
    const bubbleStyles = {
      ...this._getPositionStyle(),
      ...this._getBubbleDimensions()
    };

    const inputStyles = {
      width: newInputWidth
    };

    return (
      <div
        className={ClassNames({
          bubble: true,
          "bubble-selected": isSelected,
          understroke: true
        })}
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
        <div className="bubble--title">
          <input
            ref={this.titleInputRef}
            className="factor-title text__header"
            placeholder={BUBBLE_INPUT_PLACEHOLDER}
            type="text"
            onChange={event => this.handleInputOnChange(event)}
            value={currentFactorName}
            style={inputStyles}
            onKeyDown={e => this.handleInputKeyDown(e)}
            onClick={e => this.handleInputClick(e)}
          />
        </div>
        <div className="bubble--scores">{this._renderScoreBoxes()}</div>
      </div>
    );
  }
}

Bubble.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired
};

export default compose(
  connectActions({
    updateFactorName,
    updateFactorPosition,
    selectBubble,
    deselectBubble,
    deleteBubble,
    linkParentToSubfactor
  })
)(Bubble);
