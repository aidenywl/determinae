import React from "react";

export const DEFAULT_BUBBLE_DIAMETER = 50;

class Bubble extends React.Component {
  getPositionStyle() {
    const { x, y } = this.props;
    return {
      top: y,
      left: x,
      width: DEFAULT_BUBBLE_DIAMETER,
      height: DEFAULT_BUBBLE_DIAMETER
    };
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    return (
      <div
        className="bubble"
        style={this.getPositionStyle()}
        onClick={e => this.handleClick(e)}
      >
        <input placeholder="name" type="text" />
      </div>
    );
  }
}

export default Bubble;
