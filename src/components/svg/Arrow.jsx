import React from "react";
import PropTypes from "prop-types";

const LINE_WIDTH = 15;
const ARROW_ANGLE = 90; // degrees
const ARROW_STROKE_WIDTH = 2;

class Arrow extends React.Component {
  static distanceBetweenTwoPoints(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  static calculateSVGRotation(start, end) {
    let dy = -(end.y - start.y);
    let dx = end.x - start.x;
    const parametricAngle = Math.atan2(dy, dx);
    // SVG rotations are clockwise-positive, anti-clockwise-negative.
    // we flip the angle to align the delta radian direction calculated with atan2 with that of SVG.
    // since the arrow's starting direction is a vertical line from North to South, we normalize the angle as well by PI / 2.
    const normalizedAngle = -parametricAngle - Math.PI / 2;

    return (normalizedAngle / Math.PI) * 180;
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
            height={rectWidth / 2 + ARROW_STROKE_WIDTH}
            patternUnits="userSpaceOnUse"
          >
            <polyline
              points={`0 0 ${rectWidth / 2} ${rectWidth / 2} ${rectWidth} 0`}
              stroke="black"
              strokeWidth={ARROW_STROKE_WIDTH}
              strokeLinecap="square"
              fill="none"
              strokeLinejoin="round"
              x="0"
              y="0"
            />
          </pattern>
        </defs>
        <rect
          x="0"
          y="0"
          width={rectWidth}
          height={rectHeight}
          transform={`translate(${xTrans}, ${yTrans}) rotate(${rotation} ${rectWidth /
            2} ${rectHeight / 2})`}
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
    const clockwiseRotation = Arrow.calculateSVGRotation(startPoint, endPoint);

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
