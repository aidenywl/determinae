import React from "react";
import { compose } from "redux";

import Bubble, { DEFAULT_BUBBLE_DIAMETER } from "./Bubble";

import { connectActions } from "../reducers/configureStore";
import { createBubble, deselectBubble } from "../actions/factors";
import {
  connectAllFactors,
  connectSelectedFactor
} from "../reducers/factorReducer";
import Arrow from "./Arrow";

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
        {this._renderBubbles()}
        <svg width={240} height={240}>
          <path
            d="M220,220
            A200 200, 0, 0, 0, 20 20
            L 20 220
            Z"
            fill="lightskyblue"
          />
        </svg>
        <svg width={240} height={240}>
          <path
            d="M220,220
            A200 200, 0, 0, 0, 20 20
            L 20 120
            A100 100, 0, 0, 1, 120 220
            Z"
            fill="skyblue"
          />
          <Arrow />
        </svg>
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
