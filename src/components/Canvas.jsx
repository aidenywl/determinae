import React from "react";
import { compose } from "redux";
import PropTypes from "prop-types";

import Bubble from "./Bubble";
import Svg, { Arrow } from "./svg/Svg";

import { connectActions } from "../reducers/configureStore";
import { createBubble, deselectBubble } from "../actions/factors";
import {
  connectAllFactors,
  connectSelectedFactor,
  connectAllFactorsById
} from "../reducers/factorReducer";

/**
 * The Canvas that is drawn upon.
 */

const DEFAULT_CANVAS_HEIGHT = 4320;
const DEFAULT_CANVAS_WIDTH = 7680;

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
    const baseCanvasMetadata = getBaseCanvasRef().getBoundingClientRect();
    const baseCanvasRef = getBaseCanvasRef();
    const canvasX =
      pageX -
      this.canvasRef.current.offsetLeft +
      baseCanvasRef.scrollLeft -
      baseCanvasMetadata.left;
    const canvasY =
      pageY -
      this.canvasRef.current.offsetTop +
      baseCanvasRef.scrollTop -
      baseCanvasMetadata.top;
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

  _renderNodeRelationship() {
    const factors = this.props.factors;
    const factorMap = this.props.factorMap;
    // render all pointing from the children to the parent.
    return factors.map(factor => {
      // get current node position
      const { x, y, id } = factor;
      const startPoint = {
        x,
        y
      };

      // get parent node position
      const { parentFactorID } = factor;
      if (parentFactorID === null) {
        return null;
      }

      const parentFactor = factorMap[parentFactorID];

      const endPoint = {
        x: parentFactor.x,
        y: parentFactor.y
      };
      // render if has parent.
      return <Arrow startPoint={startPoint} endPoint={endPoint} key={id} />;
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
          {this._renderNodeRelationship()}
        </Svg>
      </div>
    );
  }
}

Canvas.defaultProps = {
  width: DEFAULT_CANVAS_WIDTH,
  height: DEFAULT_CANVAS_HEIGHT
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
  connectAllFactorsById("factorMap"),
  connectSelectedFactor("selectedFactor")
)(Canvas);
