import React from "react";
import { compose } from "redux";

import Bubble from "./Bubble";

import { connectActions } from "../reducers/configureStore";
import { createBubble } from "../actions/factors";
import { connectAllFactors } from "../reducers/factorReducer";

class Canvas extends React.Component {
  componentDidMount() {
    console.log("HEY", this.props.baseCanvasRef);
  }
  handleOnClick(e) {
    const { canvasX, canvasY } = this.getCanvasXY(e.pageX, e.pageY);
    console.log(canvasX, canvasY);
    this.props.createBubble(canvasX, canvasY);
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
    if (!factors) {
      return null;
    }

    return factors.map(factor => {
      const { x, y } = factor;
      return <Bubble x={x} y={y} />;
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
    createBubble
  }),
  connectAllFactors("factors")
)(Canvas);
