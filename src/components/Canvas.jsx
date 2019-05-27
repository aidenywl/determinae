import React from "react";
import { compose } from "redux";

import Bubble, { DEFAULT_BUBBLE_DIAMETER } from "./Bubble";

import { connectActions } from "../reducers/configureStore";
import { createBubble, deselectBubble } from "../actions/factors";
import {
  connectAllFactors,
  connectSelectedFactor
} from "../reducers/factorReducer";

class Canvas extends React.Component {
  componentDidMount() {}

  handleOnClick(e) {
    const { canvasX, canvasY } = this.getCanvasXY(e.pageX, e.pageY);
    this.props.deselectBubble();
    this.props.createBubble(
      canvasX - DEFAULT_BUBBLE_DIAMETER / 2,
      canvasY - DEFAULT_BUBBLE_DIAMETER / 2
    );
  }

  getCanvasXY(pageX, pageY) {
    const { getBaseCanvasRef } = this.props;
    const baseCanvasRef = getBaseCanvasRef();
    const canvasX = pageX - this.canvas.offsetLeft + baseCanvasRef.scrollLeft;
    const canvasY = pageY - this.canvas.offsetTop + baseCanvasRef.scrollTop;
    return {
      canvasX,
      canvasY
    };
  }

  _renderBubbles() {
    const factors = this.props.factors;
    const selectedFactor = this.props.selectedFactor;

    if (!factors) {
      return null;
    }

    return factors.map(factor => {
      const { x, y, id } = factor;
      const isSelected = selectedFactor ? id === selectedFactor.id : false;
      return (
        <Bubble
          x={x}
          y={y}
          key={id}
          id={id}
          factor={factor}
          getCanvasXY={(pageX, pageY) => this.getCanvasXY(pageX, pageY)}
          isSelected={isSelected}
        />
      );
    });
  }

  render() {
    return (
      <div
        id="canvas"
        onClick={event => this.handleOnClick(event)}
        ref={elem => (this.canvas = elem)}
      >
        Canvas
        {this._renderBubbles()}
      </div>
    );
  }
}

export default compose(
  connectActions({
    createBubble,
    deselectBubble
  }),
  connectAllFactors("factors"),
  connectSelectedFactor("selectedFactor")
)(Canvas);
