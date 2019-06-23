import React from "react";
import PropTypes from "prop-types";

const LINE_WIDTH = 15;
const ARROW_ANGLE = 90; // degrees
const ARROW_STROKE_WIDTH = 2;

class Arrow extends React.Component {
  static distanceBetweenTwoPoints(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  _drawRectangle(rectWidth, rectHeight, newCenterPoint, rotation) {
    const { x, y } = newCenterPoint;
    const xTrans = x - rectWidth / 2;
    const yTrans = y - rectHeight / 2;
    return (
      <React.Fragment>
        <defs>
          <pattern
            id="arrowPattern"
            x="0"
            y="0"
            width={rectWidth}
            height={rectHeight + ARROW_STROKE_WIDTH}
          >
            <polyline
              x="0"
              y="0"
              points={`0 0 ${rectWidth / 2} ${rectWidth / 2} ${rectWidth} 0`}
              stroke-width={ARROW_STROKE_WIDTH}
              stroke-linecap="square"
              fill="none"
              stroke-linejoin="round"
            />
          </pattern>
        </defs>
        <rect
          x="0"
          y="0"
          width={rectWidth}
          height={rectHeight}
          transform={`
          translate(${xTrans}, ${yTrans}) 
          rotate(${rotation} ${rectWidth / 2} ${rectHeight / 2})`}
          fill="url(#arrowPattern)"
        />
      </React.Fragment>
    );
  }

  _calculateCenter(p1, p2) {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    };
  }

  _drawLine(startPoint, endPoint) {
    // calculate distance.
    const distance = Arrow.distanceBetweenTwoPoints(startPoint, endPoint);

    // calculate rotation.
    const clockwiseRotation =
      2 * Math.PI -
      Math.atan2(startPoint.y - endPoint.y, startPoint.x - endPoint.x);

    // calculate line centerpoint
    const center = this._calculateCenter(startPoint, endPoint);

    // return the rectangle.
    const svgLine = this._drawRectangle(
      LINE_WIDTH,
      distance,
      center,
      clockwiseRotation
    );
    return svgLine;
  }
  render() {
    const { startPoint, endPoint } = this.props;

    return (
      <React.Fragment>{this._drawLine(startPoint, endPoint)}</React.Fragment>
    );
  }
}

Arrow.propTypes = {
  startPoint: PropTypes.object.isRequired,
  endPoint: PropTypes.object.isRequired
};

export default Arrow;
