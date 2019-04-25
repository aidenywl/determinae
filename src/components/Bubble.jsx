import React from "react";

export const BUBBLE_DIAMETER = 70;

class Bubble extends React.Component {
  getPositionStyle() {
    const { x, y } = this.props;
    return {
      top: y,
      left: x,
      width: BUBBLE_DIAMETER,
      height: BUBBLE_DIAMETER
    };
  }

  render() {
    return (
      <div
        className="bubble"
        style={this.getPositionStyle()}
        key={this.props.key}
      >
        <input placeholder="name" type="text" />
      </div>
    );
  }
}

export default Bubble;
