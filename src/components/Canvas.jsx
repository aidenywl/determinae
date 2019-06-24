import React from "react";
import { compose } from "redux";
import PropTypes from "prop-types";

import Bubble from "./Bubble";
import Svg, { Arrow } from "./svg/Svg";

import { connectActions } from "../reducers/configureStore";
import { createBubble, deselectBubble } from "../actions/factors";
import {
  connectAllFactors,
  connectSelectedFactor
} from "../reducers/factorReducer";

/**
 * The Canvas that is drawn upon.
 */

const DEFAULT_HEIGHT = "4320px";
const DEFAULT_WIDTH = "7680px";

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }
  componentDidMount() {}

  handleOnClick(e) {
    const { canvasX, canvasY } = this.getCanvasXY(e.pageX, e.pageY);
    this.props.deselectBubble();
    this.props.createBubble(canvasX, canvasY);
  }

  getCanvasXY(pageX, pageY) {
    const { getBaseCanvasRef } = this.props;
    const baseCanvasRef = getBaseCanvasRef();
    const canvasX =
      pageX - this.canvasRef.current.offsetLeft + baseCanvasRef.scrollLeft;
    const canvasY =
      pageY - this.canvasRef.current.offsetTop + baseCanvasRef.scrollTop;
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
    const { width, height } = this.props;
    return (
      <div
        id="canvas"
        onClick={event => this.handleOnClick(event)}
        ref={this.canvasRef}
        style={{ width: width, height: height }}
      >
        {this._renderBubbles()}
        <Svg width={width} height={height}>
          <path
            d="M220,220
            A200 200, 0, 0, 0, 20 20
            L 20 220
            Z"
            fill="lightskyblue"
          />
        </Svg>
      </div>
    );
  }
}

Canvas.defaultProps = {
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT
};

Canvas.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};
export default compose(
  connectActions({
    createBubble,
    deselectBubble
  }),
  connectAllFactors("factors"),
  connectSelectedFactor("selectedFactor")
)(Canvas);
