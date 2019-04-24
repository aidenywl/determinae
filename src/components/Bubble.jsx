import React from "react";

class Bubble extends React.Component {
  getPositionStyle() {
    const { x, y } = this.props;
    return {
      top: y,
      left: x
    };
  }

  render() {
    return (
      <div
        className="bubble"
        style={this.getPositionStyle()}
        key={this.props.key}
      >
        Bubble
      </div>
    );
  }
}

export default Bubble;
